import { z } from 'zod';
import { schemaToJsonSchema } from '../language/schemaUtils'

// Define the input and output types for the generateObject utility function
type GenerateObjectInput = {
  functionName: string
  args: any
  schema?: Record<string, any>
  zodSchema?: any
  settings?: any
  stream?: boolean
}

type GenerateObjectOutput = {
  stream?: ReadableStream<Uint8Array>
  object: any
  reasoning?: string
  generation: any
  text: string
  generationLatency: number
  request: any
}

/**
 * Utility function to generate an object using AI
 * This is not a Payload task, but a utility function used by executeFunction
 */
import { streamObject, CoreMessage } from 'ai'; // Import streamObject and CoreMessage
import { createOpenAI } from '@ai-sdk/openai'; // Use createOpenAI for compatibility

const getAIProvider = (modelName?: string) => {
  const providerName = modelName?.split(':')[0] || 'openai';
  const actualModelName = modelName?.includes(':') ? modelName.split(':')[1] : modelName || 'google/gemini-2.0-flash-001';
  const baseURL = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1' : 'https://openrouter.ai/api/v1';
  const apiKey = process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY;
  console.log(`>>> getAIProvider (generateObject): Using model ${actualModelName} via ${baseURL}`);
  return createOpenAI({ baseURL, apiKey })(actualModelName);
};


export const generateObject = async ({ input, req }: { input: GenerateObjectInput; req: any }): Promise<GenerateObjectOutput> => {
  const { functionName, args, schema, zodSchema, settings, stream } = input // Destructure stream
  const start = Date.now()

  // Generate the object
  const prompt = `${functionName}(${JSON.stringify(args)})`

  // Process schema if provided
  let jsonSchema
  let systemMessage = 'Respond ONLY with JSON.'

  if (input.zodSchema) {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    jsonSchema = zodToJsonSchema(input.zodSchema, {
      $refStrategy: 'none',
      target: 'openApi3',
    })
    // Enhance system message with schema information
    systemMessage = `Respond ONLY with JSON that conforms to the following schema: ${JSON.stringify(jsonSchema)}`
  } else if (schema) {
    jsonSchema = schemaToJsonSchema(schema)
    // Enhance system message with schema information
    systemMessage = `Respond ONLY with JSON that conforms to the following schema: ${JSON.stringify(jsonSchema)}`
  }

  const request = {
    model: settings?.model || 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    ...(jsonSchema && { json_schema: jsonSchema }),
    ...settings,
  }


  if (stream) {
    console.log('>>> generateObject: Streaming requested');
    try {
      const model = getAIProvider(settings?.model);
      const messages: CoreMessage[] = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ];
      const sdkSettings = { ...settings };
      delete sdkSettings.model; // Model passed separately
      delete sdkSettings.system; // System prompt in messages

      let schemaToUse: z.ZodTypeAny | undefined;
       if (zodSchema) {
           schemaToUse = zodSchema;
       } else if (schema) {
           try {
               schemaToUse = z.object(
                   Object.entries(schema).reduce((acc, [key, value]) => {
                       if (typeof value === 'string') acc[key] = z.string().describe(value);
                       else if (typeof value === 'number') acc[key] = z.number().describe(String(value));
                       else if (typeof value === 'boolean') acc[key] = z.boolean().describe(String(value));
                       else acc[key] = z.any().describe(JSON.stringify(value)); // Fallback
                       return acc;
                   }, {} as Record<string, z.ZodTypeAny>)
               );
           } catch (e) {
               console.error("Failed to convert basic schema to Zod schema:", e);
               throw new Error("Streaming object requires a valid Zod schema or a convertible basic schema.");
           }
       }


      if (!schemaToUse) {
         throw new Error("Streaming object requires a Zod schema or a basic schema definition.");
      }

      console.warn(">>> generateObject: Using streamText for object streaming. Client must parse JSON chunks.");
      const { streamText } = await import('ai'); // Import streamText locally
      const textStreamResult = await streamText({
         model: model,
         messages: messages,
         ...sdkSettings
      });

      return {
        stream: textStreamResult.textStream as any, // Return the text stream
        request: { model: settings?.model, messages, settings: sdkSettings, stream: true }
      } as any; // Cast needed because return type expects object, not stream

    } catch (error) {
       console.error('Error during streaming object generation:', error);
       throw new Error(`Streaming object generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  else { // START Non-streaming block
      const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY}`,
          'HTTP-Referer': 'https://functions.do',
          'X-Title': 'Functions.do - Reliable Structured Outputs Without Complexity',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error fetching non-streaming object: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
      }

      const generation = await response.json();
      const generationLatency = Date.now() - start;

      const text = generation?.choices?.[0]?.message?.content || '';
      const reasoning = generation?.choices?.[0]?.message?.reasoning || undefined;
      let object: any;

      try {
        object = JSON.parse(text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, ''));
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        object = { _error: 'Failed to parse JSON response', raw_response: text };
      }

      // Return the output directly
      return {
        object,
        reasoning,
        generation,
        text, // Include raw text
        generationLatency,
        request,
      };
  } // END Non-streaming block
}
