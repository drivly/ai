import { collectionSlugs } from '@/collections'
import { titleCase } from '@/lib/utils'
import type { CollectionConfig } from 'payload'
import type { OpenAPIObject, SchemaObject, PathItemObject, OperationObject, ParameterObject, ResponseObject, RequestBodyObject, ComponentsObject } from 'openapi3-ts/oas30'
import fs from 'fs/promises'
import path from 'path'

/**
 * Generate a full OpenAPI specification based on Payload collections
 */
export async function generateOpenApiSpec(payload: any): Promise<OpenAPIObject> {
  const collections = payload.collections || {}

  const projectRoot = process.cwd()
  const packageJsonPath = path.join(projectRoot, 'sdks/apis.do/package.json')
  let version = '0.0.1' // Default version if package.json is not found
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    version = packageJson.version
  } catch (error) {
    console.warn(`Could not read version from ${packageJsonPath}, using default version`, error)
  }

  const contentPath = path.join(projectRoot, 'content/index.mdx')
  const mdxContent = await fs.readFile(contentPath, 'utf8')

  const descriptionMatch = mdxContent.match(/# `.do` Business-as-Code\n\n(.*?)(?:\n\n|$)/s)
  const description = descriptionMatch
    ? descriptionMatch[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    : 'AI is getting extremely good at skills like math & code, because the outputs are verifiable. By representing your Business-as-Code, you can leverage the power of AI to automate, optimize, and scale your business processes.'

  const openApiSpec: OpenAPIObject = {
    openapi: '3.0.0',
    info: {
      title: 'APIs.do Business-as-Code',
      description,
      version,
      contact: {
        name: '.do',
        url: 'https://dotdo.ai',
      },
    },
    servers: [
      {
        url: 'https://apis.do/v1',
        description: 'Production API Server',
      },
    ],
    paths: {},
    components: {
      schemas: {},
    } as ComponentsObject,
  }

  for (const slug of collectionSlugs) {
    const collection = collections[slug]
    if (!collection) continue

    const title = collection.config?.labels?.singular || titleCase(slug)
    const pluralTitle = collection.config?.labels?.plural || `${title}s`

    if (!openApiSpec.components) {
      openApiSpec.components = { schemas: {} }
    } else if (!openApiSpec.components.schemas) {
      openApiSpec.components.schemas = {}
    }

    if (openApiSpec.components && openApiSpec.components.schemas) {
      openApiSpec.components.schemas[title] = {
        type: 'object',
        properties: generateSchemaProperties(collection),
      } as SchemaObject
    }

    openApiSpec.paths[`/${slug}`] = {
      get: {
        summary: `List all ${pluralTitle}`,
        description: collection.config?.admin?.description || `Returns a list of all ${pluralTitle}`,
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
      } as OperationObject,
      post: {
        summary: `Create a new ${title}`,
        description: collection.config?.admin?.description || `Creates a new ${title} document`,
        tags: [pluralTitle],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${title}`,
              },
            },
          },
        } as RequestBodyObject,
        responses: {
          '201': {
            description: 'Successfully created',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${title}`,
                },
              },
            },
          } as ResponseObject,
          '400': {
            description: 'Bad request',
          } as ResponseObject,
          '401': {
            description: 'Unauthorized',
          } as ResponseObject,
        },
      } as OperationObject,
    } as PathItemObject

    openApiSpec.paths[`/${slug}/{id}`] = {
      get: {
        summary: `Get a specific ${title}`,
        description: collection.config?.admin?.description || `Returns a specific ${title} by ID`,
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
          } as ParameterObject,
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
          } as ResponseObject,
          '404': {
            description: 'Not found',
          } as ResponseObject,
        },
      } as OperationObject,
      patch: {
        summary: `Update a ${title}`,
        description: collection.config?.admin?.description || `Updates a specific ${title} by ID`,
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
          } as ParameterObject,
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${title}`,
              },
            },
          },
        } as RequestBodyObject,
        responses: {
          '200': {
            description: 'Successfully updated',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${title}`,
                },
              },
            },
          } as ResponseObject,
          '400': {
            description: 'Bad request',
          } as ResponseObject,
          '401': {
            description: 'Unauthorized',
          } as ResponseObject,
          '404': {
            description: 'Not found',
          } as ResponseObject,
        },
      } as OperationObject,
      delete: {
        summary: `Delete a ${title}`,
        description: collection.config?.admin?.description || `Deletes a specific ${title} by ID`,
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
          } as ParameterObject,
        ],
        responses: {
          '200': {
            description: 'Successfully deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Successfully deleted',
                    },
                  },
                },
              },
            },
          } as ResponseObject,
          '401': {
            description: 'Unauthorized',
          } as ResponseObject,
          '404': {
            description: 'Not found',
          } as ResponseObject,
        },
      } as OperationObject,
    } as PathItemObject
  }

  openApiSpec.paths['/embed'] = {
    post: {
      summary: 'Generate embeddings',
      description: 'Generate embeddings from text using multiple providers',
      tags: ['Embeddings'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'Single text input to embed (alternative to texts)' },
                texts: { type: 'array', items: { type: 'string' }, description: 'Multiple text inputs to embed (alternative to text)' },
                model: { type: 'string', description: 'Embedding model to use' },
              },
            },
          },
        },
      } as RequestBodyObject,
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      embeddings: {
                        type: 'array',
                        items: {
                          type: 'array',
                          items: { type: 'number' },
                        },
                      },
                      model: { type: 'string' },
                    },
                  },
                  usage: {
                    type: 'object',
                    properties: {
                      tokens: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        } as ResponseObject,
        '400': {
          description: 'Bad request',
        } as ResponseObject,
        '401': {
          description: 'Unauthorized',
        } as ResponseObject,
      },
    } as OperationObject,
    get: {
      summary: 'Get embedding API information',
      description: 'Returns information about the embedding API',
      tags: ['Embeddings'],
      responses: {
        '200': {
          description: 'Successful response',
        } as ResponseObject,
      },
    } as OperationObject,
  } as PathItemObject

  return openApiSpec
}

/**
 * Generate schema properties from collection fields
 */
function generateSchemaProperties(collection: { config?: CollectionConfig }): Record<string, SchemaObject> {
  const properties: Record<string, SchemaObject> = {
    id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  }

  if (collection.config?.fields) {
    for (const field of collection.config.fields) {
      if (!('name' in field)) continue

      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'code':
        case 'email':
        case 'richText':
          properties[field.name] = { type: 'string' } as SchemaObject
          break
        case 'number':
          properties[field.name] = { type: 'number' } as SchemaObject
          break
        case 'checkbox':
          properties[field.name] = { type: 'boolean' } as SchemaObject
          break
        case 'date':
          properties[field.name] = { type: 'string', format: 'date-time' } as SchemaObject
          break
        case 'select':
          properties[field.name] = {
            type: 'string',
            enum: field.options?.map((opt: any) => (typeof opt === 'string' ? opt : opt.value)) || [],
          } as SchemaObject
          break
        case 'relationship':
          if (field.hasMany) {
            properties[field.name] = {
              type: 'array',
              items: {
                type: 'string',
                description: `ID of related ${field.relationTo} document`,
              } as SchemaObject,
            } as SchemaObject
          } else {
            properties[field.name] = {
              type: 'string',
              description: `ID of related ${field.relationTo} document`,
            } as SchemaObject
          }
          break
        case 'array':
        case 'blocks':
          properties[field.name] = {
            type: 'array',
            items: { type: 'object' } as SchemaObject,
          } as SchemaObject
          break
        case 'group':
          properties[field.name] = {
            type: 'object',
            properties: {},
          } as SchemaObject
          break
        default:
          properties[field.name] = { type: 'object' } as SchemaObject
      }
    }
  }

  return properties
}
