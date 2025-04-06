import { API } from '@/lib/api'
import { collectionSlugs } from '@/collections'
import { titleCase } from '@/lib/utils'

/**
 * Generate and return a full OpenAPI specification based on Payload collections
 */
export const GET = API(async (request, { db, user, origin, url, domain, payload }) => {
  const collections = payload.collections || {}
  
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Drivly AI API',
      description: 'API for the Drivly AI Primitives Platform',
      version: '1.0.0',
      contact: {
        name: 'Drivly',
        url: 'https://drivly.com',
      },
    },
    servers: [
      {
        url: origin,
        description: 'Current server',
      },
    ],
    paths: {},
    components: {
      schemas: {},
    },
  }

  for (const slug of collectionSlugs) {
    const collection = collections[slug]
    if (!collection) continue
    
    const title = collection.config?.labels?.singular || titleCase(slug)
    const pluralTitle = collection.config?.labels?.plural || `${title}s`
    
    openApiSpec.components.schemas[title] = {
      type: 'object',
      properties: generateSchemaProperties(collection),
    }
    
    
    openApiSpec.paths[`/api/${slug}`] = {
      get: {
        summary: `List all ${pluralTitle}`,
        description: `Returns a list of all ${pluralTitle}`,
        tags: [pluralTitle],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    links: {
                      type: 'object',
                      properties: {
                        home: { type: 'string' },
                        next: { type: 'string' },
                        prev: { type: 'string' },
                      },
                    },
                    [slug]: {
                      type: 'object',
                      additionalProperties: {
                        type: 'object',
                        properties: {
                          href: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
    
    openApiSpec.paths[`/api/${slug}/{id}`] = {
      get: {
        summary: `Get a specific ${title}`,
        description: `Returns a specific ${title} by ID`,
        tags: [pluralTitle],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: `The ID of the ${title}`,
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${title}`,
                },
              },
            },
          },
          '404': {
            description: 'Not found',
          },
        },
      },
    }
  }

  return openApiSpec
})

/**
 * Generate schema properties from collection fields
 */
function generateSchemaProperties(collection) {
  const properties = {
    id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  }
  
  if (collection.config?.fields) {
    for (const field of collection.config.fields) {
      if (!field.name) continue
      
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'code':
        case 'email':
        case 'richText':
          properties[field.name] = { type: 'string' }
          break
        case 'number':
          properties[field.name] = { type: 'number' }
          break
        case 'checkbox':
          properties[field.name] = { type: 'boolean' }
          break
        case 'date':
          properties[field.name] = { type: 'string', format: 'date-time' }
          break
        case 'select':
          properties[field.name] = { 
            type: 'string',
            enum: field.options?.map(opt => typeof opt === 'string' ? opt : opt.value) || [],
          }
          break
        case 'relationship':
          if (field.hasMany) {
            properties[field.name] = {
              type: 'array',
              items: {
                type: 'string',
                description: `ID of related ${field.relationTo} document`,
              },
            }
          } else {
            properties[field.name] = {
              type: 'string',
              description: `ID of related ${field.relationTo} document`,
            }
          }
          break
        case 'array':
        case 'blocks':
          properties[field.name] = {
            type: 'array',
            items: { type: 'object' },
          }
          break
        case 'group':
          properties[field.name] = {
            type: 'object',
            properties: {},
          }
          break
        default:
          properties[field.name] = { type: 'object' }
      }
    }
  }
  
  return properties
}
