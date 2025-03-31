import { API } from 'apis.do';

export type FieldType = 
  | 'text'
  | 'richtext'
  | 'number'
  | 'date'
  | 'boolean'
  | 'tags[]'
  | 'email'
  | string;

export type CollectionDefinition = {
  [fieldName: string]: FieldType | Record<string, any>;
};

export type DatabaseSchema = {
  [collectionName: string]: CollectionDefinition;
};

export type DatabaseOptions = {
  apiUrl?: string;
};

/**
 * Create a database client with the provided schema
 */
export const DB = (schema: DatabaseSchema, options: DatabaseOptions = {}) => {
  const api = new API({ baseUrl: options.apiUrl || 'https://database.do' });
  
  const registerSchema = async () => {
    return api.post('/api/register', { schema });
  };
  
  registerSchema().catch(console.error);
  
  const collections = Object.keys(schema).reduce((acc, collectionName) => {
    acc[collectionName] = {
      find: async (query = {}) => api.post(`/api/${collectionName}/find`, query),
      findOne: async (query = {}) => api.post(`/api/${collectionName}/findOne`, query),
      create: async (data = {}) => api.post(`/api/${collectionName}/create`, data),
      update: async (id: string, data = {}) => api.post(`/api/${collectionName}/update`, { id, data }),
      delete: async (id: string) => api.post(`/api/${collectionName}/delete`, { id }),
    };
    return acc;
  }, {} as Record<string, any>);
  
  return collections;
};

/**
 * Default export for common use case
 */
export default DB;
