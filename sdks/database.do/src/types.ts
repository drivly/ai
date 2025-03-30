/**
 * Types for database.do SDK
 */

import { ClientOptions, QueryParams, ErrorResponse, ListResponse } from 'apis.do';
export { ClientOptions, QueryParams, ErrorResponse, ListResponse };

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

export interface QueryOptions {
  where?: Record<string, any>;
  sort?: string | string[];
  limit?: number;
  page?: number;
  select?: string | string[];
  populate?: string | string[];
}

export interface DBOptions {
  baseUrl?: string;
  apiKey?: string;
  [collection: string]: any;
}

export interface CollectionMethods<T = CollectionData> {
  find: (options?: QueryOptions) => Promise<ListResponse<T>>;
  findOne: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<T>;
  search: (query: string, options?: QueryOptions) => Promise<ListResponse<T>>;
}

export interface DatabaseClient {
  [collection: string]: CollectionMethods;
}
