declare module 'agents' {
  export class Agent<Env = any, State = any> {
    constructor(config: any, state?: any);
    chat(message: string): Promise<string>;
  }
  
  export interface AgentNamespace {
    name: string;
    description?: string;
    agents: Record<string, Agent>;
  }
}
