import { API } from 'apis.do';

export type ModelOptions = {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  apiUrl?: string;
  [key: string]: any;
};

export type CompletionParams = {
  prompt: string;
  model?: string;
} & ModelOptions;

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
};

export type ChatCompletionParams = {
  messages: ChatMessage[];
  model?: string;
} & ModelOptions;

export type EmbeddingParams = {
  input: string | string[];
  model?: string;
};

/**
 * LLM client for text completion, chat, and embeddings
 */
export const LLM = (options: ModelOptions = {}) => {
  const api = new API({ baseUrl: options.apiUrl || 'https://llm.do' });
  
  return {
    /**
     * Generate text completion
     */
    completion: async (params: CompletionParams) => {
      return api.post('/api/completion', { ...params, ...options });
    },
    
    /**
     * Generate chat completion
     */
    chat: async (params: ChatCompletionParams) => {
      return api.post('/api/chat', { ...params, ...options });
    },
    
    /**
     * Generate embeddings
     */
    embeddings: async (params: EmbeddingParams) => {
      return api.post('/api/embeddings', { ...params });
    }
  };
};

/**
 * Create a function that generates text using a specific model
 */
export const llm = (model?: string, options: ModelOptions = {}) => {
  const client = LLM({ ...options, model });
  
  const completionFn = async (prompt: string, additionalOptions: ModelOptions = {}) => {
    return client.completion({ prompt, ...additionalOptions });
  };
  
  completionFn.chat = async (messages: ChatMessage[], additionalOptions: ModelOptions = {}) => {
    return client.chat({ messages, ...additionalOptions });
  };
  
  completionFn.embed = async (input: string | string[], additionalOptions: ModelOptions = {}) => {
    return client.embeddings({ input, model, ...additionalOptions });
  };
  
  return completionFn;
};

/**
 * Default export for common use case
 */
export default LLM;
