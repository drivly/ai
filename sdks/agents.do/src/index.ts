import { API } from 'apis.do';

export type AgentConfig = {
  name: string;
  role?: string;
  job?: string;
  url?: string;
  integrations?: string[];
  triggers?: string[];
  searches?: string[];
  actions?: string[];
  kpis?: string[];
  [key: string]: any;
};

export type AgentOptions = {
  apiUrl?: string;
};

export type AgentResponse<T = any> = {
  data: T;
  meta?: {
    duration?: number;
    modelName?: string;
    [key: string]: any;
  };
};

export type AgentExecutionResult = {
  id: string;
  status: 'completed' | 'failed' | 'in_progress';
  output?: any;
  error?: string;
};

/**
 * Create an agent with the provided configuration
 */
export const Agent = (config: AgentConfig, options: AgentOptions = {}) => {
  const api = new API({ baseUrl: options.apiUrl || 'https://agents.do' });
  
  const registerAgent = async () => {
    return api.post('/api/register', { config });
  };
  
  const agentPromise = registerAgent();
  
  return {
    ...config,
    execute: async (action: string, params: any = {}) => {
      await agentPromise;
      return api.post(`/api/execute`, { agent: config.name, action, params });
    },
    update: async (newConfig: Partial<AgentConfig>) => {
      await agentPromise;
      return api.post(`/api/update`, { agent: config.name, config: newConfig });
    }
  };
};

/**
 * Client for managing and executing agents
 */
export class AgentsClient {
  private api: any;
  private defaultConfig?: Partial<AgentConfig>;

  constructor(options: { apiKey?: string; baseUrl?: string; defaultConfig?: Partial<AgentConfig> } = {}) {
    this.api = new API({
      baseUrl: options.baseUrl || 'https://agents.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    });
    this.defaultConfig = options.defaultConfig;
  }

  async ask<T = any>(agentId: string, question: string, context?: any): Promise<AgentResponse<T>> {
    return this.api.post(`/api/agents/${agentId}/ask`, {
      question,
      context,
    });
  }

  async execute(
    agentId: string, 
    input: Record<string, any>, 
    options?: any
  ): Promise<AgentExecutionResult> {
    return this.api.post(`/api/agents/${agentId}/execute`, {
      input,
      options,
    });
  }

  async create(agentConfig: AgentConfig): Promise<any> {
    const config = {
      ...this.defaultConfig,
      ...agentConfig,
    };
    return this.api.post('/api/agents', config);
  }

  async list(params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.get('/api/agents', params);
  }

  async get(agentId: string): Promise<any> {
    return this.api.get(`/api/agents/${agentId}`);
  }

  async update(agentId: string, data: Partial<AgentConfig>): Promise<any> {
    return this.api.patch(`/api/agents/${agentId}`, data);
  }

  async delete(agentId: string): Promise<any> {
    return this.api.delete(`/api/agents/${agentId}`);
  }
}

/**
 * Default export for common use case
 */
export default Agent;
