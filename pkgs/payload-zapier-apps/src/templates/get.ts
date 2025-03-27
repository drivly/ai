import { ZapierCollectionConfig, ZapierField } from '../types/collection'
import { pascalCase, titleCase, sentenceCase } from '../utils/stringUtils'

/**
 * Generates output fields for a Zapier app
 * @param fields The fields to generate output fields for
 * @returns The output fields as a string
 */
function generateOutputFields(fields: ZapierField[]): string {
  return fields
    .filter((field) => typeof field === 'object' && 'name' in field && field.name && field.type)
    .map((field) => {
      const fieldName = field.name as string
      const fieldType = field.type as string

      if (['text', 'email', 'number', 'date', 'checkbox', 'textarea', 'code', 'relationship', 'array'].includes(fieldType)) {
        return `    {
      key: '${fieldName}',
      label: '${titleCase(fieldName)}'
    }`
      }
      return null
    })
    .filter(Boolean)
    .join(',\n')
}

/**
 * Generates the gets.js file for a Zapier app
 * @param collection The collection to generate the gets for
 * @returns The content of the gets.js file
 */
export function generateGetTemplate(collection: ZapierCollectionConfig): string {
  const collectionName = pascalCase(collection.slug)
  const collectionTitle = titleCase(collection.slug)
  const collectionSentence = sentenceCase(collection.slug)

  // Generate output fields based on collection fields
  const outputFields = collection.fields ? generateOutputFields(collection.fields) : ''

  return `// Get ${collectionTitle} for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: \`\${bundle.authData.apiUrl}/api/${collection.slug}/\${bundle.inputData.id}\`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  return response.data;
};

module.exports = {
  key: 'get${collectionName}',
  noun: '${collectionTitle}',
  
  display: {
    label: 'Get ${collectionTitle}',
    description: 'Gets a ${collectionSentence} by ID.'
  },
  
  operation: {
    perform,
    
    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the ${collectionSentence} to retrieve'
      }
    ],
    
    outputFields: [
      {
        key: 'id',
        label: 'ID'
      },
${outputFields}
    ],
    
    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};
`
}
