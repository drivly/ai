import { ApiHandler } from '../types';
import { createApiHandler } from '../createApiHandler';

/**
 * Creates an API handler compatible with Cloudflare Workers
 * @param getPayload - Function to get Payload CMS instance
 * @param configPromise - Payload config promise
 * @param handler - The API handler function
 * @returns Cloudflare Workers-compatible handler
 */
export const createCloudflareApiHandler = <T = any>(
  getPayload: (options: any) => Promise<any>,
  configPromise: any,
  handler: ApiHandler<T>
) => {
  const apiHandler = createApiHandler(getPayload, configPromise, handler);
  
  return async (request: Request, params: Record<string, string | string[]> = {}) => {
    const result = await apiHandler(request, params);
    
    return new Response(JSON.stringify({
      api: {
        name: new URL(request.url).hostname,
        description: 'Economically valuable work delivered through simple APIs',
        url: request.url,
        home: new URL(request.url).origin,
        login: new URL(request.url).origin + '/login',
        signup: new URL(request.url).origin + '/signup',
        admin: new URL(request.url).origin + '/admin',
        docs: new URL(request.url).origin + '/docs',
        with: 'https://apis.do',
        from: 'https://agi.do',
      },
      ...result,
      user: {},
    }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });
  };
};
