import { ZapierCollectionConfig, ZapierField } from '../types/collection'
import { pascalCase, titleCase, sentenceCase } from '../utils/stringUtils'

/**
 * Generates input fields for a Zapier app
 * @param fields The fields to generate input fields for
 * @param collectionSentence The collection name in sentence case
 * @returns The input fields as a string
 */
function generateInputFields(fields: ZapierField[], collectionSentence: string): string {
  return fields
    .filter(field => typeof field === 'object' && 'name' in field && field.name && field.type)
    .map(field => {
      const fieldName = field.name as string
      const fieldType = field.type as string
      const required = 'required' in field && field.required === true
      
      if (['text', 'email', 'number', 'date', 'checkbox', 'textarea', 'code'].includes(fieldType)) {
        return `    {
      key: '${fieldName}',
      label: '${titleCase(fieldName)}',
      type: '${fieldType === 'number' ? 'number' : fieldType === 'checkbox' ? 'boolean' : 'string'}',
      required: ${required},
      helpText: 'The ${sentenceCase(fieldName)} of the ${collectionSentence}'
    }`
      } else if (fieldType === 'relationship' && field.relationTo) {
        // Handle relationship fields
        const relationTo = Array.isArray(field.relationTo) ? field.relationTo[0] : field.relationTo
        return `    {
      key: '${fieldName}',
      label: '${titleCase(fieldName)}',
      type: 'string',
      required: ${required},
      helpText: 'The ID of the related ${relationTo}'
    }`
      } else if (fieldType === 'array' && field.fields) {
        // Handle array fields (simplified - in real implementation would need dynamic fields)
        return `    {
      key: '${fieldName}',
      label: '${titleCase(fieldName)}',
      type: 'string',
      required: ${required},
      helpText: 'JSON array of ${fieldName} items'
    }`
      }
      return null
    })
    .filter(Boolean)
    .join(',\n')
}

/**
 * Generates output fields for a Zapier app
 * @param fields The fields to generate output fields for
 * @returns The output fields as a string
 */
function generateOutputFields(fields: ZapierField[]): string {
  return fields
    .filter(field => typeof field === 'object' && 'name' in field && field.name && field.type)
    .map(field => {
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
 * Generates the creates.js file for a Zapier app
 * @param collection The collection to generate the creates for
 * @returns The content of the creates.js file
 */
export function generateCreateTemplate(collection: ZapierCollectionConfig): string {
  const collectionName = pascalCase(collection.slug)
  const collectionTitle = titleCase(collection.slug)
  const collectionSentence = sentenceCase(collection.slug)

  // Generate input fields based on collection fields
  const inputFields = collection.fields
    ? generateInputFields(collection.fields, collectionSentence)
    : ''

  // Generate output fields based on collection fields
  const outputFields = collection.fields
    ? generateOutputFields(collection.fields)
    : ''

  return `// Create ${collectionTitle} for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: \`\${bundle.authData.apiUrl}/api/${collection.slug}\`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: bundle.inputData
  });

  return response.data;
};

module.exports = {
  key: 'create${collectionName}',
  noun: '${collectionTitle}',
  
  display: {
    label: 'Create ${collectionTitle}',
    description: 'Creates a new ${collectionSentence}.'
  },
  
  operation: {
    perform,
    
    inputFields: [
${inputFields}
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