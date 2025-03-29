/**
 * workflows.do - SDK for creating AI-powered workflows with strongly-typed functions
 */

type AIFunction<T = any, R = any> = (params: { ai: any; db: any; api: any; args: T }) => Promise<R>;

type AIFunctionSchema = Record<string, any>;

type AIConfig = {
  [key: string]: AIFunction | AIFunctionSchema;
};

/**
 * Creates an AI instance with typed methods based on the provided schemas
 * @param config Object containing event handlers and function schemas
 * @returns AI instance with typed methods
 */
export function AI<T extends AIConfig>(config: T) {
  return config as any;
}

export default AI;
