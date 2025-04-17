import { streamText, CoreMessage } from 'ai'; // Import streamText and CoreMessage
import { createOpenAI } from '@ai-sdk/openai'; // Use createOpenAI for compatibility

// Define the input and output types for the generateText utility function
type GenerateTextInput = {
  functionName: string
  args: any
  settings?: any
  stream?: boolean // Add stream flag
}

type GenerateTextOutput = {
  text?: string // Optional for streaming
  stream?: ReadableStream<Uint8Array> // Vercel AI SDK uses Uint8Array stream
  reasoning?: string
  generation?: any // Might not be available immediately in streaming
  generationLatency?: number // Might not be available immediately in streaming
  request?: any
}

const getAIProvider = (modelName?: string) => {
  const providerName = modelName?.split(':')[0] || 'openai'; // Default to openai
  const actualModelName = modelName?.includes(':') ? modelName.split(':')[1] : modelName || 'google/gemini-2.0-flash-001'; // Default model from original code

  const baseURL = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1' : 'https://openrouter.ai/api/v1'; // Use gateway or OpenRouter, ensure base path is correct
  const apiKey = process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY;

  console.log(`>>> getAIProvider: Using model ${actualModelName} via ${baseURL}`);
  return createOpenAI({ baseURL, apiKey })(actualModelName);
};


/**
 * Utility function to generate text using AI
 * This is not a Payload task, but a utility function used by executeFunction
 */
export const generateText = async ({ input, req }: { input: GenerateTextInput; req: any }): Promise<GenerateTextOutput> => {
  const { functionName, args, settings, stream } = input // Destructure stream flag
  const start = Date.now()

  // Generate the text
  const prompt = `${functionName}(${JSON.stringify(args)})`
  const modelName = settings?.model || 'google/gemini-2.0-flash-001'; // Use default from original code

  const messages: CoreMessage[] = [
    { role: 'system', content: settings?.system || 'Respond in markdown format.' }, // Use settings system prompt or default
    { role: 'user', content: prompt },
  ];

  const sdkSettings = { ...settings };
  delete sdkSettings.model; // Model is passed separately to the provider
  delete sdkSettings.system; // System prompt is part of messages

  if (stream) {
    console.log('>>> generateText: Streaming requested');
    try {
      const model = getAIProvider(modelName);
      const result = await streamText({
        model: model,
        messages: messages,
        ...sdkSettings // Pass remaining settings like temperature, maxTokens etc.
      });

      return {
        stream: result.textStream as any, // textStream is ReadableStream<string> & AsyncIterable<string>. Cast needed if expecting Uint8Array. TODO: Verify stream type compatibility.
        request: { model: modelName, messages, settings: sdkSettings, stream: true } // Include request details for logging/debugging
      };
    } catch (error) {
       console.error('Error during streaming text generation:', error);
       throw new Error(`Streaming text generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

  } else {
    console.log('>>> generateText: Non-streaming request');
    const requestBody = {
      model: modelName,
      messages: messages.map(m => ({ role: m.role, content: m.content })), // Map to expected format if different
      ...sdkSettings, // Include other settings
    };

    const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY}`,
        'HTTP-Referer': 'https://functions.do',
        'X-Title': 'Functions.do - Reliable Structured Outputs Without Complexity',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error fetching non-streaming text: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const generation = await response.json();
    const generationLatency = Date.now() - start;

    const text = generation?.choices?.[0]?.message?.content || '';
    const reasoning = generation?.choices?.[0]?.message?.reasoning || undefined;

    return {
      text,
      reasoning,
      generation,
      generationLatency,
      request: requestBody,
    };
  }
}
