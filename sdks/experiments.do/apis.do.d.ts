/**
 * Type declarations for apis.do
 */

declare module 'apis.do' {
  export interface Function {
    id: string
    name?: string
    type: string
    code?: string
    prompt?: string
    updatedAt: string
    createdAt: string
  }

  export interface Workflow {
    id: string
    name?: string
    description?: string
    type?: string
    code?: string
    updatedAt: string
    createdAt: string
  }

  export interface Experiment {
    id: string
    name?: string
    description?: string
    status?: 'active' | 'inactive' | 'completed'
    variants?: Record<string, any>[]
    metrics?: string[]
    updatedAt: string
    createdAt: string
  }

  export class API {
    constructor(options?: any)
    list<T>(resource: string, params?: Record<string, any>): Promise<{ data: T[] }>
    getById<T>(resource: string, id: string): Promise<T>
    create<T>(resource: string, data: Partial<T>): Promise<T>
    update<T>(resource: string, id: string, data: Partial<T>): Promise<T>
    remove<T>(resource: string, id: string): Promise<T>
    get<T>(path: string, params?: Record<string, any>): Promise<T>
    post<T>(path: string, data: any): Promise<T>
  }

  export const api: API
}
