import {
  API,
  api as apisDoClient,
  ClientOptions,
  ListResponse,
  QueryParams
} from 'apis.do';

import {
  DBOptions,
  SchemaDefinition,
  CollectionMethods,
  QueryOptions,
  CollectionData,
  DatabaseClient as DatabaseClientType
} from './types';

export * from './types';

class CollectionHandler<T = CollectionData> implements CollectionMethods<T> {
  private api: API;
  private collection: string;

  constructor(api: API, collection: string) {
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

export const DB = (options: DBOptions = {}): DatabaseClientType => {
  const { baseUrl, apiKey, ...schemaDefinitions } = options;
  
  const apiOptions: ClientOptions = {
    baseUrl: baseUrl || 'https://database.do',
    apiKey
  };
  
  const api = new API(apiOptions);

  return new Proxy({} as DatabaseClientType, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop !== 'then') {
        return new CollectionHandler(api, prop);
      }
      return target[prop as keyof typeof target];
    }
  });
};

export const db = DB();

export class DatabaseClient {
  private api: API;

  constructor(options: DBOptions = {}) {
    const apiOptions: ClientOptions = {
      baseUrl: options.baseUrl || 'https://database.do',
      apiKey: options.apiKey
    };
    
    this.api = new API(apiOptions);
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
