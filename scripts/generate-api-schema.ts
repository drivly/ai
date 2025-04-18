import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Generate a basic OpenAPI schema and save it to the public directory
 * This is a simplified version that creates a static schema file
 * without requiring Payload initialization
 */
async function generateApiSchema() {
  try {
    console.log('Generating static OpenAPI schema...')

    const projectRoot = process.cwd()
    const packageJsonPath = path.join(projectRoot, 'sdks/apis.do/package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    const version = packageJson.version

    const contentPath = path.join(projectRoot, 'content/index.mdx')
    const mdxContent = await fs.readFile(contentPath, 'utf8')

    const descriptionMatch = mdxContent.match(/# `.do` Business-as-Code\n\n(.*?)(?:\n\n|$)/s)
    const description = descriptionMatch
      ? descriptionMatch[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      : 'AI is getting extremely good at skills like math & code, because the outputs are verifiable. By representing your Business-as-Code, you can leverage the power of AI to automate, optimize, and scale your business processes.'

    const openApiSpec = {
      openapi: '3.0.0',
      info: {
        title: 'APIs.do Business-as-Code',
        description,
        version,
        contact: {
          name: 'Drivly',
          url: 'https://drivly.com',
        },
      },
      servers: [
        {
          url: 'https://apis.do/v1',
          description: 'Production API Server',
        },
      ],
      paths: {
        '/ai': {
          get: {
            summary: 'List all AIs',
            description: 'Returns a list of all AIs',
            tags: ['AIs'],
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
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          AI: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    }

    const publicDir = path.join(projectRoot, 'public')
    try {
      await fs.access(publicDir)
    } catch (error) {
      await fs.mkdir(publicDir, { recursive: true })
    }

    const outputPath = path.join(publicDir, 'api.json')
    await fs.writeFile(outputPath, JSON.stringify(openApiSpec, null, 2))

    console.log(`✅ Generated static API schema at ${outputPath}`)
  } catch (error) {
    console.error('Error generating API schema:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateApiSchema().catch(console.error)
}

export { generateApiSchema }
