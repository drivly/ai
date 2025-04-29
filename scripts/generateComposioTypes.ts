import fs from 'fs'
import path from 'path'
import { convertActionNameWithMultiWordIntegrations } from '../utils/composioUtils'

interface ComposioParameter {
  type: string
  description?: string
  required?: boolean
  enum?: string[]
  items?: ComposioParameter
  properties?: Record<string, ComposioParameter>
}

interface ComposioAction {
  id: string
  name: string
  description?: string
  parameters?: Record<string, ComposioParameter>
  response?: any
}

async function fetchComposioActions(): Promise<ComposioAction[]> {
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    console.warn('Composio API key not configured, using placeholder data')
    return [
      {
        id: 'GITHUB_CREATE_ISSUE',
        name: 'Create Issue',
        description: 'Creates a new issue in a GitHub repository',
        parameters: {
          owner: { type: 'string', required: true },
          repo: { type: 'string', required: true },
          title: { type: 'string', required: true },
          body: { type: 'string' },
          labels: { type: 'array', items: { type: 'string' } },
        },
        response: {
          id: { type: 'number' },
          number: { type: 'number' },
          html_url: { type: 'string' },
          title: { type: 'string' },
          body: { type: 'string' },
          labels: { type: 'array' },
        },
      },
    ]
  }

  try {
    const response = await fetch('https://backend.composio.dev/api/v2/actions/list/all', {
      headers: {
        'x-api-key': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch actions: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.actions || []
  } catch (error) {
    console.warn('Error fetching Composio actions, using placeholder data:', error)
    return [
      {
        id: 'GITHUB_CREATE_ISSUE',
        name: 'Create Issue',
        description: 'Creates a new issue in a GitHub repository',
        parameters: {
          owner: { type: 'string', required: true },
          repo: { type: 'string', required: true },
          title: { type: 'string', required: true },
          body: { type: 'string' },
          labels: { type: 'array', items: { type: 'string' } },
        },
        response: {
          id: { type: 'number' },
          number: { type: 'number' },
          html_url: { type: 'string' },
          title: { type: 'string' },
          body: { type: 'string' },
          labels: { type: 'array' },
        },
      },
    ]
  }
}

function determineType(paramSchema: ComposioParameter): string {
  if (!paramSchema || !paramSchema.type) return 'any'

  switch (paramSchema.type) {
    case 'string':
      if (paramSchema.enum && paramSchema.enum.length > 0) {
        return paramSchema.enum.map((e) => `'${e}'`).join(' | ')
      }
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      if (paramSchema.items) {
        return `${determineType(paramSchema.items)}[]`
      }
      return 'any[]'
    case 'object':
      if (paramSchema.properties) {
        const propertyTypes: string[] = []
        for (const [propName, propSchema] of Object.entries(paramSchema.properties)) {
          const isRequired = Array.isArray(paramSchema.required) && paramSchema.required.includes(propName)
          propertyTypes.push(`${propName}${isRequired ? '' : '?'}: ${determineType(propSchema)}`)
        }
        return `{ ${propertyTypes.join('; ')} }`
      }
      return 'Record<string, any>'
    default:
      return 'any'
  }
}

async function generateComposioTypes() {
  try {
    console.log('Fetching Composio actions...')
    const actions = await fetchComposioActions()
    console.log(`Fetched ${actions.length} actions`)

    const integrationActions: Record<string, Record<string, { parameters: Record<string, ComposioParameter>; response: any }>> = {}

    actions.forEach((action) => {
      const convertedName = convertActionNameWithMultiWordIntegrations(action.id)
      const [integration, actionName] = convertedName.split('.')

      if (!integrationActions[integration]) {
        integrationActions[integration] = {}
      }

      integrationActions[integration][actionName] = {
        parameters: action.parameters || {},
        response: action.response || {},
      }
    })

    if (Object.keys(integrationActions).length === 0) {
      integrationActions.github = {
        createIssue: {
          parameters: {
            owner: { type: 'string', required: true },
            repo: { type: 'string', required: true },
            title: { type: 'string', required: true },
            body: { type: 'string' },
            labels: { type: 'array', items: { type: 'string' } },
          },
          response: {
            id: { type: 'number' },
            number: { type: 'number' },
            html_url: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string' },
            labels: { type: 'array' },
          },
        },
      }
    }

    let typesContent = `/**
 * Generated TypeScript types for Composio actions
 * DO NOT EDIT DIRECTLY - This file is generated at build time
 */

export interface ComposioActionTypes {
`

    Object.keys(integrationActions)
      .sort()
      .forEach((integration) => {
        typesContent += `  ${integration}: {\n`

        Object.keys(integrationActions[integration])
          .sort()
          .forEach((action) => {
            typesContent += `    ${action}: {\n`
            typesContent += `      parameters: {\n`

            const params = integrationActions[integration][action].parameters
            Object.keys(params)
              .sort()
              .forEach((param) => {
                const paramType = determineType(params[param])
                const required = params[param].required === true
                typesContent += `        ${param}${required ? '' : '?'}: ${paramType};\n`
              })

            typesContent += `      };\n`

            const response = integrationActions[integration][action].response
            if (response && Object.keys(response).length > 0) {
              typesContent += `      response: {\n`
              Object.keys(response)
                .sort()
                .forEach((prop) => {
                  const propType = determineType(response[prop])
                  typesContent += `        ${prop}: ${propType};\n`
                })
              typesContent += `      };\n`
            } else {
              typesContent += `      response: any;\n`
            }

            typesContent += `    };\n`
          })

        typesContent += `  };\n`
      })

    typesContent += `}\n\n`

    typesContent += `export const COMPOSIO_ACTIONS = [\n`
    Object.keys(integrationActions)
      .sort()
      .forEach((integration) => {
        Object.keys(integrationActions[integration])
          .sort()
          .forEach((action) => {
            typesContent += `  '${integration}.${action}',\n`
          })
      })
    typesContent += `] as const;\n\n`

    typesContent += `export type ComposioActionName = typeof COMPOSIO_ACTIONS[number];\n`

    const cwd = process.cwd()
    const isRunningFromPackage = cwd.includes('sdks/actions.do')

    const baseDir = isRunningFromPackage ? path.resolve(cwd, '../..') : cwd
    const generatedDir = path.join(baseDir, 'sdks', 'actions.do', 'generated')
    const srcDir = path.join(baseDir, 'sdks', 'actions.do', 'src')

    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true })
    }

    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true })
    }

    const typesPath = path.join(generatedDir, 'types.ts')
    fs.writeFileSync(typesPath, typesContent)
    console.log(`Generated types written to ${typesPath}`)

    const constantsContent = `/**
 * Generated Action constants
 * DO NOT EDIT DIRECTLY - This file is generated at build time
 */

export const ACTION_NAMES = ${JSON.stringify(
      Object.keys(integrationActions).flatMap((integration) => Object.keys(integrationActions[integration]).map((action) => `${integration}.${action}`)),
      null,
      2,
    )} as const;

export type ActionName = (typeof ACTION_NAMES)[number];
`

    const constantsPath = path.join(srcDir, 'constants.ts')
    fs.writeFileSync(constantsPath, constantsContent)
    console.log(`Generated constants written to ${constantsPath}`)
  } catch (error) {
    console.error('Error generating types:', error)
    process.exit(1)
  }
}

generateComposioTypes()
