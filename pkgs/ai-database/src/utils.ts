/**
 * Utility functions for ai-database
 */

import { DBOptions, PayloadInstance, RestClientConfig } from './types'

/**
 * Standardized error handling utility for database operations
 * @param error Original error object
 * @param operation Operation type (find, findOne, create, update, delete, search)
 * @param collection Collection name
 * @returns Never - always throws an enhanced error
 */
export const handleError = (error: any, operation: string, collection: string): never => {
  const errorMessage = error.message || 'Unknown error'
  const statusCode = error.status || error.statusCode || 500
  const enhancedError = new Error(`${operation} operation failed on collection '${collection}': ${errorMessage}`)

  Object.assign(enhancedError, {
    statusCode,
    operation,
    collection,
    originalError: error,
  })

  throw enhancedError
}

/**
 * Transforms query options from database.do format to Payload format
 * @param options Query options in database.do format
 * @returns Transformed options in Payload format
 */
export const transformQueryOptions = (options: any = {}): any => {
  const result: any = {}

  if (options.where) {
    result.where = options.where
  }

  if (options.sort) {
    if (Array.isArray(options.sort)) {
      result.sort = options.sort.join(',')
    } else {
      result.sort = options.sort
    }
  }

  if (options.limit) {
    result.limit = options.limit
  }

  if (options.page) {
    result.page = options.page
  }

  if (options.select) {
    if (Array.isArray(options.select)) {
      result.fields = options.select
    } else {
      result.fields = [options.select]
    }
  }

  if (options.populate) {
    if (typeof options.populate === 'string') {
      result.depth = 1
    } else if (Array.isArray(options.populate) && options.populate.length > 0) {
      result.depth = 1
    }
  }

  return result
}

/**
 * Gets or creates a Payload instance based on the provided options
 * @param options DB options
 * @returns Payload instance or compatible client
 */
export const getPayloadInstance = (options: DBOptions): PayloadInstance => {
  if (options.payload) {
    return options.payload
  }

  if (options.apiUrl) {
    const restConfig: RestClientConfig = {
      apiUrl: options.apiUrl,
      apiKey: options.apiKey,
      headers: options.headers,
      fetchOptions: options.fetchOptions,
    }

    return createRestClient(restConfig)
  }

  try {
    if (typeof global !== 'undefined' && global.payload) {
      return global.payload
    }
  } catch (e) {}

  throw new Error('No Payload instance provided. Please provide a payload instance or apiUrl.')
}

/**
 * Creates a REST client for Payload CMS
 * @param config REST client configuration
 * @returns REST client compatible with Payload instance
 */
const createRestClient = (config: RestClientConfig): PayloadInstance => {
  const { apiUrl, apiKey, headers = {}, fetchOptions = {} } = config

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (apiKey) {
    requestHeaders['Authorization'] = `Bearer ${apiKey}`
  }

  return {
    find: async (options: any) => {
      const { collection, ...params } = options
      const searchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value))
        } else {
          searchParams.append(key, String(value))
        }
      })

      const url = `${apiUrl}/${collection}?${searchParams.toString()}`
      const response = await fetch(url, {
        method: 'GET',
        headers: requestHeaders,
        ...fetchOptions,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to fetch from ${collection}`)
      }

      return response.json()
    },

    findByID: async (options: any) => {
      const { collection, id, ...params } = options
      const searchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value))
        } else {
          searchParams.append(key, String(value))
        }
      })

      const url = `${apiUrl}/${collection}/${id}?${searchParams.toString()}`
      const response = await fetch(url, {
        method: 'GET',
        headers: requestHeaders,
        ...fetchOptions,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to fetch ${id} from ${collection}`)
      }

      return response.json()
    },

    create: async (options: any) => {
      const { collection, data } = options
      const url = `${apiUrl}/${collection}`

      const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data),
        ...fetchOptions,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to create document in ${collection}`)
      }

      return response.json()
    },

    update: async (options: any) => {
      const { collection, id, data } = options
      const url = `${apiUrl}/${collection}/${id}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify(data),
        ...fetchOptions,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to update document ${id} in ${collection}`)
      }

      return response.json()
    },

    delete: async (options: any) => {
      const { collection, id } = options
      const url = `${apiUrl}/${collection}/${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: requestHeaders,
        ...fetchOptions,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to delete document ${id} from ${collection}`)
      }

      return response.json()
    },
  }
}
