/**
 * Integration configuration interface
 */
export interface IntegrationConfig {
  /** Name of the integration */
  name: string;
  /** Description of the integration */
  description: string;
  /** Authentication methods */
  auth?: {
    /** OAuth configuration */
    oauth?: {
      /** Authorization URL */
      authorizationUrl: string;
      /** Token URL */
      tokenUrl: string;
      /** Required scopes */
      scope: string[];
    };
    /** API Key configuration */
    apiKey?: {
      /** Header name for API key */
      headerName: string;
      /** Prefix for API key value */
      prefix?: string;
    };
  };
  /** Available operations */
  operations?: Record<string, {
    /** Operation description */
    description: string;
    /** Input schema */
    inputSchema: Record<string, string>;
    /** Execute function */
    execute: (inputs: any, auth: any) => Promise<any>;
  }>;
  /** Event triggers */
  triggers?: Record<string, {
    /** Trigger description */
    description: string;
    /** Setup webhook function */
    setupWebhook: (config: any, auth: any) => Promise<any>;
  }>;
}

/**
 * Integration connection interface
 */
export interface IntegrationConnection {
  /** Connection ID */
  id: string;
  /** Service name */
  service: string;
  /** Connection status */
  status: 'active' | 'inactive' | 'error';
  /** Authentication details */
  auth: {
    /** Authentication type */
    type: 'oauth' | 'apiKey';
    /** Expiration timestamp */
    expiresAt?: string;
  };
  /** Available methods */
  [key: string]: any;
}

/**
 * Trigger interface
 */
export interface Trigger {
  /** Trigger ID */
  id: string;
  /** Trigger type */
  type: 'webhook' | 'websocket' | 'scheduled' | 'manual';
  /** Source service */
  source: string;
  /** Event name */
  event: string;
  /** Filter criteria */
  filter?: Record<string, any>;
  /** Action function */
  action: (event: any) => Promise<any>;
  /** Enable the trigger */
  enable: () => Promise<void>;
  /** Disable the trigger */
  disable: () => Promise<void>;
}

/**
 * Action interface
 */
export interface Action {
  /** Action ID */
  id: string;
  /** Action name */
  name: string;
  /** Action description */
  description: string;
  /** Source service */
  source: string;
  /** Operation name */
  operation: string;
  /** Input schema */
  inputSchema: Record<string, string>;
  /** Execute the action */
  execute: (inputs: any) => Promise<any>;
}
