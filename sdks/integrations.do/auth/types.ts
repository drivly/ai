/**
 * Options for OAuth authentication flow.
 * These options are typically passed to the backend for handling the OAuth dance.
 */
export interface OAuthOptions {
  clientId: string;
  clientSecret?: string; // May not be needed directly by SDK client
  scope: string[];
}

/**
 * Options for API Key authentication.
 */
export interface ApiKeyOptions {
  apiKey: string;
  headerName?: string; // Optional: Backend might know the default
  prefix?: string;     // Optional: Backend might know the default
}

export type IntegrationAuthOptions = 
  | ({ type: 'oauth' } & OAuthOptions)
  | ({ type: 'apiKey' } & ApiKeyOptions);
