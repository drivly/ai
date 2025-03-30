import { ApiClient } from './api-client';
import {
  DBOptions,
  SchemaDefinition,
  CollectionMethods,
  QueryOptions,
  ListResponse,
  DatabaseClient as DatabaseClientType
} from './types';

export * from './types';

class CollectionHandler implements CollectionMethods {
  private api: ApiClient;
  private collection: string;

  constructor(api: ApiClient, collection: string) {
    this.api = api;
    this.collection = collection;
  }

  async find(options: QueryOptions = {}): Promise<any> {
    return this.api.list(this.collection, options);
  }

  async findOne(id: string): Promise<any> {
    return this.api.getById(this.collection, id);
  }

  async create(data: any): Promise<any> {
    return this.api.create(this.collection, data);
  }

  async update(id: string, data: any): Promise<any> {
    return this.api.update(this.collection, id, data);
  }

  async delete(id: string): Promise<any> {
    return this.api.remove(this.collection, id);
  }

  async search(query: string, options: QueryOptions = {}): Promise<any> {
    return this.api.search(this.collection, query, options);
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

  async find(collection: string, options: QueryOptions = {}): Promise<any> {
    return this.api.list(collection, options);
  }

  async findOne(collection: string, id: string): Promise<any> {
    return this.api.getById(collection, id);
  }

  async create(collection: string, data: any): Promise<any> {
    return this.api.create(collection, data);
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    return this.api.update(collection, id, data);
  }

  async delete(collection: string, id: string): Promise<any> {
    return this.api.remove(collection, id);
  }

  async search(collection: string, query: string, options: QueryOptions = {}): Promise<any> {
    return this.api.search(collection, query, options);
  }
}

export default DB;
