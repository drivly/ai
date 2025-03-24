import { ZapierCollectionConfig } from '../types/collection'
import { pascalCase, titleCase } from '../utils/stringUtils'

/**
 * Generates the authentication.js file for a Zapier app
 * @param collection The collection to generate the authentication for
 * @returns The content of the authentication.js file
 */
export function generateAuthenticationTemplate(collection: ZapierCollectionConfig): string {
  const collectionName = pascalCase(collection.slug)
  const collectionTitle = titleCase(collection.slug)

  return `// Authentication for ${collectionTitle} Zapier App
module.exports = {
  type: 'custom',
  
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      helpText: 'Your AI Primitives API key'
    },
    {
      key: 'apiUrl',
      label: 'API URL',
      type: 'string',
      required: true,
      default: 'https://ai.do',
      helpText: 'The URL of the AI Primitives API'
    }
  ],
  
  test: {
    url: '{{bundle.authData.apiUrl}}/api/${collection.slug}',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer {{bundle.authData.apiKey}}',
      'Content-Type': 'application/json'
    },
    params: {
      limit: 1
    },
    body: {},
    removeMissingValuesFrom: {},
  },
  
  connectionLabel: '{{bundle.authData.apiUrl}}'
};
`
}