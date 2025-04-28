/**
 * Types for the Durable Objects NoSQL package
 */

/**
 * MongoDB-style query operators
 */
export type QueryOperator = '$eq' | '$gt' | '$gte' | '$lt' | '$lte' | '$ne' | '$in' | '$nin' | '$and' | '$or' | '$nor' | '$not' | '$exists' | '$type' | '$regex'

/**
 * MongoDB-style update operators
 */
export type UpdateOperator = '$set' | '$unset' | '$inc' | '$push' | '$pull' | '$addToSet' | '$pop'

/**
 * MongoDB-style query object
 */
export type Query = {
  [key: string]: any | { [key in QueryOperator]?: any }
}

/**
 * MongoDB-style update object
 */
export type Update = {
  [key in UpdateOperator]?: { [field: string]: any }
}

/**
 * Result of an insert operation
 */
export interface InsertOneResult {
  id: string
}

/**
 * Result of a bulk insert operation
 */
export interface InsertManyResult {
  ids: string[]
}

/**
 * Result of an update operation
 */
export interface UpdateResult {
  matchedCount: number
  modifiedCount: number
}

/**
 * Result of a delete operation
 */
export interface DeleteResult {
  deletedCount: number
}

/**
 * Options for find operations
 */
export interface FindOptions {
  limit?: number
  skip?: number
  sort?: { [key: string]: 1 | -1 }
}

/**
 * Cursor for iterating over query results
 */
export interface Cursor<T = any> {
  toArray(): Promise<T[]>
  first(): Promise<T | null>
  count(): Promise<number>
  limit(n: number): Cursor<T>
  skip(n: number): Cursor<T>
  sort(sortSpec: { [key: string]: 1 | -1 }): Cursor<T>
}

/**
 * Collection interface for MongoDB-style operations
 */
export interface Collection<T = any> {
  find(query?: Query, options?: FindOptions): Cursor<T>
  findOne(query?: Query): Promise<T | null>
  insertOne(document: T): Promise<InsertOneResult>
  insertMany(documents: T[]): Promise<InsertManyResult>
  updateOne(query: Query, update: Update): Promise<UpdateResult>
  updateMany(query: Query, update: Update): Promise<UpdateResult>
  deleteOne(query: Query): Promise<DeleteResult>
  deleteMany(query: Query): Promise<DeleteResult>
}

/**
 * Document stored in the database
 */
export interface StoredDocument {
  id: string
  collection: string
  data: string // JSON stringified data
}

/**
 * Transaction interface for Durable Object Storage
 */
export interface DurableObjectTransaction {
  get<T = unknown>(key: string): Promise<T | undefined>
  get<T = unknown>(keys: string[]): Promise<Map<string, T>>
  put<T>(key: string, value: T): Promise<void>
  put<T>(entries: Record<string, T>): Promise<void>
  delete(key: string): Promise<boolean>
  delete(keys: string[]): Promise<number>
}

/**
 * Cloudflare Worker DurableObjectStorage interface (partial)
 */
export interface DurableObjectStorage {
  sql: {
    exec<T>(
      query: string,
      ...bindings: any[]
    ): {
      next(): { done?: boolean; value?: T }
    }
  }
  transaction<T>(closure: (txn: DurableObjectTransaction) => Promise<T>): Promise<T>
  get<T = unknown>(key: string): Promise<T | undefined>
  get<T = unknown>(keys: string[]): Promise<Map<string, T>>
  put<T>(key: string, value: T): Promise<void>
  put<T>(entries: Record<string, T>): Promise<void>
  delete(key: string): Promise<boolean>
  delete(keys: string[]): Promise<number>
}
