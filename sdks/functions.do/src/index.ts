import { API } from 'apis.do';

export type FunctionOptions = {
  apiUrl?: string;
  model?: string;
};

export type FunctionDefinition = Record<string, any>;

export interface FunctionResponse<T = any> {
  data: T;
  meta?: {
    duration?: number;
    modelName?: string;
    [key: string]: any;
  };
}

/**
 * Create an AI function instance with provided schema
 */
export const AI = (schema: FunctionDefinition, options: FunctionOptions = {}) => {
  const api = new API({ baseUrl: options.apiUrl || 'https://functions.do' });
  
  const registerSchema = async () => {
    return api.post('/api/register', { schema, options });
  };
  
  registerSchema().catch(console.error);
  
  return new Proxy({} as Record<string, (params: any) => Promise<any>>, {
    get(target, prop) {
      if (typeof prop === 'string' && schema[prop]) {
        return async (params: any) => {
          return api.post(`/api/${prop}`, params);
        };
      }
      
      return undefined;
    }
  });
};

/**
 * Client for managing and executing functions
 */
export class FunctionsClient {
  private api: any;

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new API({
      baseUrl: options.baseUrl || 'https://functions.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    });
  }

  async run<T = any>(functionName: string, input: any, options?: FunctionOptions): Promise<FunctionResponse<T>> {
    return this.api.post(`/api/functions/${functionName}`, {
      input,
      options,
    });
  }

  async create(functionDefinition: {
    name: string;
    description?: string;
    schema?: FunctionDefinition;
    [key: string]: any;
  }): Promise<any> {
    return this.api.post('/api/functions', functionDefinition);
  }

  async list(params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.get('/api/functions', params);
  }

  async get(functionId: string): Promise<any> {
    return this.api.get(`/api/functions/${functionId}`);
  }

  async update(functionId: string, data: any): Promise<any> {
    return this.api.patch(`/api/functions/${functionId}`, data);
  }

  async delete(functionId: string): Promise<any> {
    return this.api.delete(`/api/functions/${functionId}`);
  }
}

/**
 * Simple client for direct API access
 */
export const ai = new Proxy({} as Record<string, (params: any) => Promise<any>>, {
  get(target, prop) {
    const api = new API({ baseUrl: 'https://functions.do' });
    
    return async (params: any = {}, options: any = {}) => {
      return api.post(`/api/${String(prop)}`, { ...params, ...options });
    };
  }
});

export default AI;
