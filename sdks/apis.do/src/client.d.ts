import { ClientOptions, ListResponse, QueryParams } from './types.js'
export declare class API {
  private baseUrl
  private headers
  private options?
  constructor(options?: ClientOptions)
  private request
  get<T>(path: string, params?: QueryParams): Promise<T>
  get<T>(collection: string, id: string): Promise<T>
  post<T>(path: string, data: any): Promise<T>
  put<T>(path: string, data: any): Promise<T>
  patch<T>(path: string, data: any): Promise<T>
  delete<T>(path: string): Promise<T>
  list<T>(collection: string, params?: QueryParams): Promise<ListResponse<T>>
  getById<T>(collection: string, id: string): Promise<T>
  create<T>(collection: string, data: Partial<T>): Promise<T>
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T>
  replace<T>(collection: string, id: string, data: T): Promise<T>
  remove<T>(collection: string, id: string): Promise<T>
  search<T>(collection: string, query: string, params?: QueryParams): Promise<ListResponse<T>>
}
