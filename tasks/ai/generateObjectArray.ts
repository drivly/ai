import { streamText } from 'ai';
import { schemaToJsonSchema } from '../language/schemaUtils'

type GenerateObjectArrayInput = {
  functionName: string
  args: any
  schema?: Record<string, any>
  zodSchema?: any
  settings?: any
  stream?: boolean
}

type GenerateObjectArrayOutput = {
  objectArray?: any[] // Made optional as it won't exist in streaming response
  stream?: ReadableStream<Uint8Array>
  reasoning?: string
  generation?: any // Made optional
  text?: string // Made optional
  generationLatency?: number // Made optional
  request?: any
}

/**
 * Utility function to generate an array of objects using AI
 * This is not a Payload task, but a utility function used by executeFunction
 */
import { streamObject, CoreMessage } from 'ai'; // Import streamObject and CoreMessage
import { createOpenAI } from '@ai-sdk/openai'; // Use createOpenAI for compatibility
import { z } from 'zod'; // Import Zod

const getAIProvider = (modelName?: string) => {
  const providerName = modelName?.split(':')[0] || 'openai';
  const actualModelName = modelName?.includes(':') ? modelName.split(':')[1] : modelName || 'google/gemini-2.0-flash-001';
  const baseURL = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1' : 'https://openrouter.ai/api/v1';
  const apiKey = process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY;
  console.log(`>>> getAIProvider (generateObjectArray): Using model ${actualModelName} via ${baseURL}`);
  return createOpenAI({ baseURL, apiKey })(actualModelName);
};

export const generateObjectArray = async ({ input, req }: { input: GenerateObjectArrayInput; req: any }): Promise<GenerateObjectArrayOutput> => {
  const { functionName, args, schema, zodSchema, settings, stream } = input // Destructure stream
  const start = Date.now()

  const prompt = `${functionName}(${JSON.stringify(args)})`

  let jsonSchema
  let systemMessage = 'Respond ONLY with a JSON object that has an "items" property containing an array of objects.'

  if (input.zodSchema) {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    jsonSchema = zodToJsonSchema(input.zodSchema, {
      $refStrategy: 'none',
      target: 'openApi3',
    })
    systemMessage = `Respond ONLY with a JSON object that has an "items" property containing an array of objects that conform to the following schema: ${JSON.stringify(jsonSchema)}`
  } else if (schema) {
    jsonSchema = schemaToJsonSchema(schema)
    systemMessage = `Respond ONLY with a JSON object that has an "items" property containing an array of objects that conform to the following schema: ${JSON.stringify(jsonSchema)}`
  }

  if (stream) {
    console.log('>>> generateObjectArray: Streaming requested');
    try {
      const model = getAIProvider(settings?.model); // Use settings from input
      const messages: CoreMessage[] = [
        { role: 'system', content: systemMessage }, // Use systemMessage defined above
        { role: 'user', content: prompt }, // Use prompt defined above
      ];
      const sdkSettings = { ...settings }; // Use settings from input
      delete sdkSettings.model;
      delete sdkSettings.system; // System prompt is in messages

      let arraySchemaToUse: z.ZodArray<any> | undefined;
      if (zodSchema) { // Use zodSchema from input
          if (zodSchema instanceof z.ZodArray) {
              arraySchemaToUse = zodSchema;
          } else {
              console.warn(">>> generateObjectArray: Provided Zod schema is not an array schema. Wrapping it in z.array().");
              arraySchemaToUse = z.array(zodSchema);
          }
      } else if (schema) { // Use schema from input
          try {
              const itemSchema = z.object(
                  Object.entries(schema).reduce((acc, [key, value]) => {
                      if (typeof value === 'string') acc[key] = z.string().describe(value);
                      else if (typeof value === 'number') acc[key] = z.number().describe(String(value));
                      else if (typeof value === 'boolean') acc[key] = z.boolean().describe(String(value));
                      else acc[key] = z.any().describe(JSON.stringify(value));
                      return acc;
                  }, {} as Record<string, z.ZodTypeAny>)
              );
              arraySchemaToUse = z.array(itemSchema);
          } catch (e) {
               console.error("Failed to convert basic schema to Zod array schema:", e);
               throw new Error("Streaming object array requires a valid Zod array schema or a convertible basic schema.");
          }
      }

      if (!arraySchemaToUse) {
         throw new Error("Streaming object array requires a Zod array schema or a basic item schema definition.");
      }

      console.warn(">>> generateObjectArray: Using streamText for object array streaming. Client must parse JSON chunks/lines.");
      const textStreamResult = await streamText({
         model: model,
         messages: messages,
         ...sdkSettings
      });

      return {
        stream: textStreamResult.textStream as any, // Return text stream
        request: { model: settings?.model, messages, settings: sdkSettings, stream: true } // Include request details
      } as any; // Cast needed because return type expects objectArray, not stream

    } catch (error) {
       console.error('Error during streaming object array generation:', error);
       throw new Error(`Streaming object array generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  else { // START Non-streaming block
    const request = {
      model: settings?.model || 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: systemMessage }, // Use systemMessage defined above
        { role: 'user', content: prompt }, // Use prompt defined above
      ],
      response_format: { type: 'json_object' },
      ...(jsonSchema && { json_schema: jsonSchema }), // Use jsonSchema defined above
      ...settings, // Use settings from input
    }

    const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY}`,
        'HTTP-Referer': 'https://functions.do',
        'X-Title': 'Functions.do - Reliable Structured Outputs Without Complexity',
      },
      body: JSON.stringify(request), // Use request defined in this block
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error fetching non-streaming object array: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const generation = await response.json();
    const generationLatency = Date.now() - start; // Use start defined above

    const text = generation?.choices?.[0]?.message?.content || '';
    const reasoning = generation?.choices?.[0]?.message?.reasoning || undefined;
    let objectArray: any[] = [];

    try {
      const parsed = JSON.parse(text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, ''));

      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
        objectArray = parsed.items;
      } else if (Array.isArray(parsed)) {
        objectArray = parsed;
      } else {
        console.warn(">>> generateObjectArray: Response was not an array or {items: []}. Wrapping single object.");
        objectArray = [parsed]; // Tentative: wrap single object
      }
    } catch (error) {
      console.error('Error parsing JSON array response:', error);
      objectArray = [{ _error: 'Failed to parse JSON array response', raw_response: text }];
    }

    return {
      objectArray,
      reasoning,
      generation,
      text, // Include raw text
      generationLatency,
      request, // Return the request used for this call
    };
  } // END Non-streaming block
}
