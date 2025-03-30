/**
 * Types for database.do SDK
 */

/**
 * Field types supported by the database
 */
export type FieldType = 
  | 'text' 
  | 'richtext' 
  | 'number' 
  | 'date' 
  | 'boolean'
  | 'select'
  | 'email'
  | 'tags[]'
  | string; // For relationships and custom types

/**
 * Schema definition for collections
 */
export type SchemaDefinition = {
  [collection: string]: {
    [field: string]: FieldType;
  };
};

/**
 * Generic collection data type
 */
export type CollectionData = Record<string, any>;

/**
 * Options for API client
 */
export interface ClientOptions {
  baseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

/**
 * Query parameters for list operations
 */
export interface QueryParams {
  [key: string]: any;
  limit?: number;
  page?: number;
  sort?: string | string[];
  where?: Record<string, any>;
}

/**
 * Query options for collection operations
 */
export interface QueryOptions {
  where?: Record<string, any>;
  sort?: string | string[];
  limit?: number;
  page?: number;
  select?: string | string[];
  populate?: string | string[];
}

/**
 * Options for database client initialization
 */
export interface DBOptions {
  baseUrl?: string;
  apiKey?: string;
  [collection: string]: any;
}

/**
 * Methods available on each collection
 */
export interface CollectionMethods<T = CollectionData> {
  find: (options?: QueryOptions) => Promise<ListResponse<T>>;
  findOne: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<T>;
  search: (query: string, options?: QueryOptions) => Promise<ListResponse<T>>;
}

/**
 * Database client interface
 */
export interface DatabaseClient {
  [collection: string]: CollectionMethods;
}

/**
 * Response for list operations
 */
export interface ListResponse<T> {
  data: T[];
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasNextPage?: boolean;
  };
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  errors?: Array<{
    message: string;
    code?: string;
    path?: string;
  }>;
}
