/**
 * Type definitions for the API client
 */
export interface ClientOptions {
  baseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

export interface ErrorResponse {
  errors?: Array<{ message: string }>;
}

export interface ListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface QueryParams {
  [key: string]: any;
  limit?: number;
  page?: number;
  sort?: string;
  where?: Record<string, any>;
}

export * from '../types.js';
