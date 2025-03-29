/**
 * Type definitions for payload-rest-client
 */

declare module 'payload-rest-client' {
  export interface PayloadRestAPIClientConfig {
    url: string
    apiKey?: string
    headers?: Record<string, string>
    fetchOptions?: RequestInit
  }

  export interface PayloadRestAPIClient {
    find: (options: any) => Promise<any>
    findByID: (options: any) => Promise<any>
    create: (options: any) => Promise<any>
    update: (options: any) => Promise<any>
    delete: (options: any) => Promise<any>
    api?: {
      url: string
      fetch: (endpoint: string, options?: RequestInit) => Promise<Response>
    }
    [key: string]: any
  }

  /**
   * Creates a REST API client for Payload CMS
   */
  export function createPayloadRestAPIClient(config: PayloadRestAPIClientConfig): PayloadRestAPIClient
}
