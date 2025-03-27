import { CollectionData, CollectionQuery, PayloadDB, RestPayloadClientConfig } from './types'

/**
 * Creates a REST client for Payload that works in edge environments
 * @param config - REST client configuration
 * @returns A proxy object for database operations via REST API
 */
export const createRestPayloadClient = (config: RestPayloadClientConfig): PayloadDB => {
  const { apiUrl, apiKey, headers: customHeaders = {} } = config
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }
  
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const methods: Record<string, any> = {}

  return new Proxy(
    {},
    {
      get: (target, collectionName) => {
        const collection = String(collectionName)

        return new Proxy(
          {},
          {
            get: (_, method) => {
              const methodName = String(method)

              switch (methodName) {
                case 'find':
                  methods.find = async (query: CollectionQuery = {}) => {
                    const queryParams = new URLSearchParams()
                    Object.entries(query).forEach(([key, value]) => {
                      if (typeof value === 'object') {
                        queryParams.append(key, JSON.stringify(value))
                      } else {
                        queryParams.append(key, String(value))
                      }
                    })
                    
                    const response = await fetch(
                      `${apiUrl}/api/${collection}?${queryParams.toString()}`,
                      { headers }
                    )
                    
                    if (!response.ok) {
                      throw new Error(`API Error: ${response.status} ${response.statusText}`)
                    }
                    
                    return response.json()
                  }
                  return methods.find

                case 'findOne':
                  methods.findOne = async (query: CollectionQuery = {}) => {
                    const result = await methods.find(query)
                    return result.docs?.[0] || null
                  }
                  return methods.findOne

                case 'get':
                case 'findById':
                case 'findByID':
                  methods.get = async (id: string, query: CollectionQuery = {}) => {
                    const queryParams = new URLSearchParams()
                    Object.entries(query).forEach(([key, value]) => {
                      if (typeof value === 'object') {
                        queryParams.append(key, JSON.stringify(value))
                      } else {
                        queryParams.append(key, String(value))
                      }
                    })
                    
                    const queryString = queryParams.toString()
                    const url = `${apiUrl}/api/${collection}/${id}${queryString ? `?${queryString}` : ''}`
                    
                    const response = await fetch(url, { headers })
                    
                    if (!response.ok) {
                      throw new Error(`API Error: ${response.status} ${response.statusText}`)
                    }
                    
                    return response.json()
                  }
                  return methods.get

                case 'create':
                  methods.create = async (data: CollectionData, query: CollectionQuery = {}) => {
                    const response = await fetch(
                      `${apiUrl}/api/${collection}`,
                      {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(data),
                      }
                    )
                    
                    if (!response.ok) {
                      throw new Error(`API Error: ${response.status} ${response.statusText}`)
                    }
                    
                    return response.json()
                  }
                  return methods.create

                case 'update':
                  methods.update = async (id: string, data: CollectionData, query: CollectionQuery = {}) => {
                    const response = await fetch(
                      `${apiUrl}/api/${collection}/${id}`,
                      {
                        method: 'PATCH',
                        headers,
                        body: JSON.stringify(data),
                      }
                    )
                    
                    if (!response.ok) {
                      throw new Error(`API Error: ${response.status} ${response.statusText}`)
                    }
                    
                    return response.json()
                  }
                  return methods.update

                case 'upsert':
                case 'set':
                  methods.upsert = async (id: string, data: CollectionData, query: CollectionQuery = {}) => {
                    try {
                      await methods.get(id)
                      return await methods.update(id, data)
                    } catch (error) {
                      return await methods.create({ ...data, id })
                    }
                  }
                  return methods.upsert

                case 'delete':
                  methods.delete = async (id: string, query: CollectionQuery = {}) => {
                    const response = await fetch(
                      `${apiUrl}/api/${collection}/${id}`,
                      {
                        method: 'DELETE',
                        headers,
                      }
                    )
                    
                    if (!response.ok) {
                      throw new Error(`API Error: ${response.status} ${response.statusText}`)
                    }
                    
                    return response.json()
                  }
                  return methods.delete

                default:
                  throw new Error(`Method ${methodName} not implemented for collection ${collection}`)
              }
            },
          },
        )
      },
    },
  ) as PayloadDB
}
