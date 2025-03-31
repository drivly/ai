/**
 * workflows.do - SDK for creating AI-powered workflows with strongly-typed functions
 */

import { API } from 'apis.do';

export type WorkflowOptions = {
  apiUrl?: string;
};

export type Workflow = {
  [key: string]: (params: any) => Promise<any>;
};

export type WorkflowContext = {
  ai: any;
  api: any;
  db: any;
};

export type WorkflowExecutionOptions = {
  async?: boolean;
  timeout?: number;
};

export type WorkflowExecutionResult = {
  id: string;
  status: 'completed' | 'failed' | 'in_progress';
  output?: any;
  error?: string;
};

/**
 * Create a workflow instance with provided handlers
 */
export const AI = (workflow: Workflow, options: WorkflowOptions = {}) => {
  const api = new API({ baseUrl: options.apiUrl || 'https://workflows.do' });
  
  return new Proxy(workflow, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver);
      
      if (originalValue !== undefined) {
        return originalValue;
      }
      
      return async (params: any) => {
        return api.post(`/api/${String(prop)}`, params);
      };
    }
  });
};

/**
 * Creates a new workflow
 * @param workflow Workflow configuration
 * @returns Workflow instance
 */
export function createWorkflow(workflow: Workflow) {
  const api = new API({ baseUrl: 'https://workflows.do' });
  
  return {
    ...workflow,
    execute: async (input: Record<string, any>, options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult> => {
      return api.post('/api/workflows/execute', {
        workflow,
        input,
        options,
      });
    },
  };
}

/**
 * Simple client for direct API access
 */
export const ai = new Proxy({} as Record<string, (params: any) => Promise<any>>, {
  get(target, prop) {
    const api = new API({ baseUrl: 'https://workflows.do' });
    
    return async (params: any = {}, options: any = {}) => {
      return api.post(`/api/${String(prop)}`, { ...params, ...options });
    };
  }
});

export default AI;
