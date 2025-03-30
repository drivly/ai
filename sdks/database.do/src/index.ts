import { ApiClient } from './api-client';
import {
  DBOptions,
  SchemaDefinition,
  CollectionMethods,
  QueryOptions,
  ListResponse,
  DatabaseClient as DatabaseClientType,
  CollectionData
} from './types';

export * from './types';

class CollectionHandler implements CollectionMethods {
  private api: ApiClient;
  private collection: string;

  constructor(api: ApiClient, collection: string) {
    this.api = api;
    this.collection = collection;
  }

  async find<T = CollectionData>(options: QueryOptions = {}): Promise<ListResponse<T>> {
    return this.api.list<T>(this.collection, options);
  }

  async findOne<T = CollectionData>(id: string): Promise<T> {
    return this.api.getById<T>(this.collection, id);
  }

  async create<T = CollectionData>(data: Partial<T>): Promise<T> {
    return this.api.create<T>(this.collection, data);
  }

  async update<T = CollectionData>(id: string, data: Partial<T>): Promise<T> {
    return this.api.update<T>(this.collection, id, data);
  }

  async delete<T = CollectionData>(id: string): Promise<T> {
    return this.api.remove<T>(this.collection, id);
  }

  async search<T = CollectionData>(query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    return this.api.search<T>(this.collection, query, options);
  }
}

export function DB(options: DBOptions = {}): DatabaseClientType {
  const { baseUrl, apiKey, ...schemaDefinitions } = options;
  
  const api = new ApiClient({
    baseUrl: baseUrl || 'https://database.do',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
  });

  return new Proxy({} as DatabaseClientType, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop !== 'then') {
        return new CollectionHandler(api, prop);
      }
      return target[prop as keyof typeof target];
    }
  });
}

export const db = DB();

export class DatabaseClient {
  private api: ApiClient;

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://database.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    });
  }

  async find<T = CollectionData>(collection: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    return this.api.list<T>(collection, options);
  }

  async findOne<T = CollectionData>(collection: string, id: string): Promise<T> {
    return this.api.getById<T>(collection, id);
  }

  async create<T = CollectionData>(collection: string, data: Partial<T>): Promise<T> {
    return this.api.create<T>(collection, data);
  }

  async update<T = CollectionData>(collection: string, id: string, data: Partial<T>): Promise<T> {
    return this.api.update<T>(collection, id, data);
  }

  async delete<T = CollectionData>(collection: string, id: string): Promise<T> {
    return this.api.remove<T>(collection, id);
  }

  async search<T = CollectionData>(collection: string, query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    return this.api.search<T>(collection, query, options);
  }
}

export default DB;
