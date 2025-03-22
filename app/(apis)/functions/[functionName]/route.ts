import { API } from 'clickable-apis'
import { ai } from 'ai-functions'

// Parse function name with arguments like: writeBlogPost(title:Amazing_Puppies)
function parseFunctionCall(rawFunctionName) {
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
  const args = {}
  
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

export const GET = API(async (request, { params }) => {
  const { functionName: rawFunctionName } = params
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
  } = Object.fromEntries(url.searchParams)
  
  // Build AI settings object
  const aiSettings = {
    ...(seed !== undefined && { seed: Number(seed) }),
    ...(prompt !== undefined && { prompt }),
    ...(system !== undefined && { system }),
    ...(temperature !== undefined && { temperature: Number(temperature) }),
    ...(maxTokens !== undefined && { maxTokens: Number(maxTokens) }),
    ...(model !== undefined && { model })
  }
  
  // Merge parsed args with remaining query params
  const functionArgs = { ...parsedArgs, ...restQueryParams }
  
  try {
    // Call the AI function with the function name, args, and settings
    const result = Object.keys(aiSettings).length > 0
      ? await ai[functionName](functionArgs, aiSettings)
      : await ai[functionName](functionArgs)
    
    return { success: true, result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      functionName,
      parsedArgs: functionArgs,
      aiSettings
    }
  }
})

export const POST = API(async (request, { params }) => {
  const { functionName: rawFunctionName } = params
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
  } = Object.fromEntries(url.searchParams)
  
  // Build AI settings object
  const aiSettings = {
    ...(seed !== undefined && { seed: Number(seed) }),
    ...(prompt !== undefined && { prompt }),
    ...(system !== undefined && { system }),
    ...(temperature !== undefined && { temperature: Number(temperature) }),
    ...(maxTokens !== undefined && { maxTokens: Number(maxTokens) }),
    ...(model !== undefined && { model })
  }
  
  // Get input from request body
  let body = {}
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
  
  try {
    // Call the AI function with arguments and settings
    const result = Object.keys(aiSettings).length > 0
      ? await ai[functionName](mergedArgs, aiSettings)
      : await ai[functionName](mergedArgs)
    
    return { success: true, result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      functionName,
      parsedArgs: mergedArgs,
      aiSettings
    }
  }
})