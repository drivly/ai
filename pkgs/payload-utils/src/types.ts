/**
 * Types for payload database operations
 */

// Base types for collection operations
export type CollectionQuery = Record<string, any>;
export type CollectionData = Record<string, any>;

// Generic payload collection type
export interface PayloadDBCollection {
  find: (query?: CollectionQuery) => Promise<any>;
  findOne: (query?: CollectionQuery) => Promise<any>; // Returns first item or null
  get: (id: string, query?: CollectionQuery) => Promise<any>; // Alias for findById
  create: (data: CollectionData, query?: CollectionQuery) => Promise<any>;
  update: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>;
  upsert: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>;
  set: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>; // Alias for update
  delete: (id: string, query?: CollectionQuery) => Promise<any>;
}

// Define the DB type as a collection of collections
export type PayloadDB = Record<string, PayloadDBCollection>;

// Common context type for API handlers
export type ApiContext = {
  params: Record<string, string | string[]>;
  url: URL;
  path: string;
  domain: string;
  origin: string;
  user: any; // Payload user object type
  permissions: any; // Payload permissions object type
  payload: any; // Payload instance
  db: PayloadDB; // Enhanced database access
};

// Generic request type that works with both NextJS and Cloudflare Workers
export interface ApiRequest {
  url: string;
  method?: string;
  headers: Headers | Record<string, string>;
  json?: () => Promise<any>;
}

// Generic handler type
export type ApiHandler<T = any> = (req: ApiRequest, ctx: ApiContext) => Promise<T> | T;
