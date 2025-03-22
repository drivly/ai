import { API } from 'clickable-apis'
import { ai } from 'ai-functions'
import { createHash } from 'crypto'

// Define basic types for database entities
interface DbEntity {
  id: string;
  [key: string]: any;
}

// Parse function name with arguments like: writeBlogPost(title:Amazing_Puppies)
function parseFunctionCall(rawFunctionName: string): { name: string; args: Record<string, string> } {
  // Extract function name and args string
  const match = rawFunctionName.match(/^([^(]+)(?:\(([^)]*)\))?$/)
  
  if (!match) {
    return { name: rawFunctionName, args: {} }
  }
  
  const [, name, argsString] = match
  
  // If no args, return just the name
  if (!argsString || argsString.trim() === '') {
    return { name, args: {} }
  }
  
  // Parse arguments
  const args: Record<string, string> = {}
  
  try {
    // Try to parse as JSON-like with some flexibility
    const argPairs = argsString.split(',')
    
    for (const pair of argPairs) {
      // Handle key:value format (allowing no spaces after colon)
      const [key, ...valueParts] = pair.split(':')
      
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim() 
        
        // Replace underscores with spaces
        const processedValue = value.replace(/_/g, ' ')
        
        // Add to args object
        args[key.trim()] = processedValue
      }
    }
  } catch (e) {
    // If parsing fails, use the raw string as the first argument
    args.input = argsString.replace(/_/g, ' ')
  }
  
  return { name, args }
}

// Generate a hash from data object for deduplication
function generateHash(data: any): string {
  // Sort keys to ensure consistent hash regardless of property order
  const sortedData = JSON.stringify(data, Object.keys(data).sort())
  return createHash('sha256').update(sortedData).digest('hex')
}

// Database operations to store function call data
async function storeExecutionData(
  db: any, 
  functionName: string, 
  inputArgs: Record<string, any>, 
  inputHash: string, 
  outputData: any, 
  outputHash: string, 
  aiSettings: Record<string, any>, 
  success: boolean, 
  error: string | null = null
) {
  try {
    // 1. First, try to find or create the function in the database
    let functionRecord: DbEntity
    const functionRecords = await db.functions.find({
      where: {
        name: {
          equals: functionName
        }
      }
    })
    
    if (functionRecords.docs && functionRecords.docs.length > 0) {
      functionRecord = functionRecords.docs[0]
    } else {
      // Create function record if it doesn't exist
      functionRecord = await db.functions.create({
        name: functionName,
        type: 'Object' // Default type
      })
    }
    
    // 2. Store the input as a Thing
    let inputThing: DbEntity
    // Try to find existing Thing by hash
    const existingInputs = await db.things.find({
      where: {
        hash: {
          equals: inputHash
        }
      }
    })
    
    if (existingInputs.docs && existingInputs.docs.length > 0) {
      inputThing = existingInputs.docs[0]
    } else {
      const nounId = await getOrCreateNoun(db, 'Input')
      // Create new input Thing
      inputThing = await db.things.create({
        name: `Input for ${functionName}`,
        hash: inputHash,
        data: inputArgs,
        type: nounId
      })
    }
    
    // 3. Store the output as a Thing
    let outputThing: DbEntity
    // Try to find existing Thing by hash
    const existingOutputs = await db.things.find({
      where: {
        hash: {
          equals: outputHash
        }
      }
    })
    
    if (existingOutputs.docs && existingOutputs.docs.length > 0) {
      outputThing = existingOutputs.docs[0]
    } else {
      const nounId = await getOrCreateNoun(db, 'Output')
      // Create new output Thing
      outputThing = await db.things.create({
        name: `Output from ${functionName}`,
        hash: outputHash,
        data: outputData,
        type: nounId
      })
    }
    
    // 4. Create the Action linking function, input, and output
    const verbId = await getOrCreateVerb(db, 'Execute')
    const action = await db.actions.create({
      subject: inputThing.id,
      verb: verbId,
      object: outputThing.id
    })
    
    // 5. Create Generation record with timing and execution details
    await db.generations.create({
      action: action.id,
      request: inputArgs,
      response: outputData,
      error: error,
      status: success ? 'success' : 'error',
      duration: 0, // We don't have timing info in this implementation
    })
    
    return { 
      actionId: action.id,
      inputId: inputThing.id,
      outputId: outputThing.id
    }
  } catch (dbError) {
    console.error('Database error:', dbError)
    // Continue with the function execution even if database operations fail
    return null
  }
}

// Helper to get or create a Noun
async function getOrCreateNoun(db: any, name: string): Promise<string> {
  const existingNouns = await db.nouns.find({
    where: {
      name: {
        equals: name
      }
    }
  })
  
  if (existingNouns.docs && existingNouns.docs.length > 0) {
    return existingNouns.docs[0].id
  }
  
  const newNoun = await db.nouns.create({
    name
  })
  
  return newNoun.id
}

// Helper to get or create a Verb
async function getOrCreateVerb(db: any, action: string): Promise<string> {
  const existingVerbs = await db.verbs.find({
    where: {
      action: {
        equals: action
      }
    }
  })
  
  if (existingVerbs.docs && existingVerbs.docs.length > 0) {
    return existingVerbs.docs[0].id
  }
  
  const newVerb = await db.verbs.create({
    action,
    act: `${action}s`,
    activity: `${action}ing`,
    event: `${action}d`,
    subject: `${action}r`,
    object: `${action}ion`
  })
  
  return newVerb.id
}

export const GET = API(async (request, { params, db }) => {
  const { functionName: rawFunctionName } = params as { functionName: string }
  const { name: functionName, args: parsedArgs } = parseFunctionCall(rawFunctionName)
  
  // Extract special AI setting parameters and the rest of the query params
  const url = new URL(request.url)
  const {
    seed,
    prompt,
    system,
    temperature,
    maxTokens,
    model,
    ...restQueryParams
  } = Object.fromEntries(url.searchParams) as Record<string, string>
  
  // Build AI settings object
  const aiSettings: Record<string, any> = {
    ...(seed !== undefined && { seed: Number(seed) }),
    ...(prompt !== undefined && { prompt }),
    ...(system !== undefined && { system }),
    ...(temperature !== undefined && { temperature: Number(temperature) }),
    ...(maxTokens !== undefined && { maxTokens: Number(maxTokens) }),
    ...(model !== undefined && { model })
  }
  
  // Merge parsed args with remaining query params
  const functionArgs = { ...parsedArgs, ...restQueryParams }
  
  // Generate hash for input data (for deduplication)
  const inputHash = generateHash(functionArgs)
  
  try {
    // Call the AI function with the function name, args, and settings
    const result = Object.keys(aiSettings).length > 0
      ? await (ai as any)[functionName](functionArgs, aiSettings)
      : await (ai as any)[functionName](functionArgs)
    
    // Generate hash for output data (for deduplication)
    const outputHash = generateHash(result)
    
    // Store the execution data in the database
    if (db) {
      await storeExecutionData(
        db, 
        functionName,
        functionArgs, 
        inputHash,
        result, 
        outputHash,
        aiSettings,
        true
      )
    }
    
    return { success: true, result }
  } catch (error) {
    // Store failed execution in the database
    if (db) {
      await storeExecutionData(
        db,
        functionName,
        functionArgs,
        inputHash,
        null,
        generateHash({}), // Empty hash for failed output
        aiSettings,
        false,
        error instanceof Error ? error.message : String(error)
      )
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      functionName,
      parsedArgs: functionArgs,
      aiSettings
    }
  }
})

export const POST = API(async (request, { params, db }) => {
  const { functionName: rawFunctionName } = params as { functionName: string }
  const { name: functionName, args: urlArgs } = parseFunctionCall(rawFunctionName)
  
  // Extract special AI setting parameters from query string
  const url = new URL(request.url)
  const {
    seed,
    prompt,
    system,
    temperature,
    maxTokens,
    model,
    ...restQueryParams
  } = Object.fromEntries(url.searchParams) as Record<string, string>
  
  // Build AI settings object
  const aiSettings: Record<string, any> = {
    ...(seed !== undefined && { seed: Number(seed) }),
    ...(prompt !== undefined && { prompt }),
    ...(system !== undefined && { system }),
    ...(temperature !== undefined && { temperature: Number(temperature) }),
    ...(maxTokens !== undefined && { maxTokens: Number(maxTokens) }),
    ...(model !== undefined && { model })
  }
  
  // Get input from request body
  let body: Record<string, any> = {}
  try {
    body = await request.json()
    
    // If body contains AI settings, extract them
    const { 
      seed: bodySeed, 
      prompt: bodyPrompt, 
      system: bodySystem, 
      temperature: bodyTemperature,
      maxTokens: bodyMaxTokens,
      model: bodyModel,
      ...restBody 
    } = body
    
    // Add body AI settings (query params take precedence)
    if (seed === undefined && bodySeed !== undefined) aiSettings.seed = Number(bodySeed)
    if (prompt === undefined && bodyPrompt !== undefined) aiSettings.prompt = bodyPrompt
    if (system === undefined && bodySystem !== undefined) aiSettings.system = bodySystem
    if (temperature === undefined && bodyTemperature !== undefined) aiSettings.temperature = Number(bodyTemperature)
    if (maxTokens === undefined && bodyMaxTokens !== undefined) aiSettings.maxTokens = Number(bodyMaxTokens)
    if (model === undefined && bodyModel !== undefined) aiSettings.model = bodyModel
    
    // Update body to only contain non-settings parameters
    body = restBody
  } catch (e) {
    // If body parsing fails, continue with empty object
  }
  
  // Merge URL args with body and query params, with URL args taking highest precedence
  const mergedArgs = { ...body, ...restQueryParams, ...urlArgs }
  
  // Generate hash for input data (for deduplication)
  const inputHash = generateHash(mergedArgs)
  
  try {
    // Call the AI function with arguments and settings
    const result = Object.keys(aiSettings).length > 0
      ? await (ai as any)[functionName](mergedArgs, aiSettings)
      : await (ai as any)[functionName](mergedArgs)
    
    // Generate hash for output data (for deduplication)
    const outputHash = generateHash(result)
    
    // Store the execution data in the database
    if (db) {
      await storeExecutionData(
        db, 
        functionName,
        mergedArgs, 
        inputHash,
        result, 
        outputHash,
        aiSettings,
        true
      )
    }
    
    return { success: true, result }
  } catch (error) {
    // Store failed execution in the database
    if (db) {
      await storeExecutionData(
        db,
        functionName,
        mergedArgs,
        inputHash,
        null,
        generateHash({}), // Empty hash for failed output
        aiSettings,
        false,
        error instanceof Error ? error.message : String(error)
      )
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      functionName,
      parsedArgs: mergedArgs,
      aiSettings
    }
  }
})