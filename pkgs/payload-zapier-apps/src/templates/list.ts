import { ZapierCollectionConfig, ZapierField } from '../types/collection'
import { camelCase, pascalCase, titleCase, sentenceCase } from '../utils/stringUtils'

/**
 * Generates input fields for filtering in a Zapier app
 * @param fields The fields to generate input fields for
 * @returns The input fields as a string
 */
function generateInputFields(fields: ZapierField[]): string {
  return fields
    .filter((field) => typeof field === 'object' && 'name' in field && field.name && field.type)
    .map((field) => {
      const fieldName = field.name as string
      const fieldType = field.type as string

      if (['text', 'email', 'number', 'date', 'textarea', 'code'].includes(fieldType)) {
        return `    {
      key: '${fieldName}',
      label: '${titleCase(fieldName)}',
      type: '${fieldType === 'number' ? 'number' : 'string'}',
      required: false,
      helpText: 'Filter by ${sentenceCase(fieldName)}'
    }`
      } else if (fieldType === 'relationship' && field.relationTo) {
        // Handle relationship fields
        const relationTo = Array.isArray(field.relationTo) ? field.relationTo[0] : field.relationTo
        return `    {
      key: '${fieldName}',
      label: '${titleCase(fieldName)}',
      type: 'string',
      required: false,
      helpText: 'Filter by the ID of the related ${relationTo}'
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
 * Generates the searches.js file for a Zapier app
 * @param collection The collection to generate the searches for
 * @returns The content of the searches.js file
 */
export function generateListTemplate(collection: ZapierCollectionConfig): string {
  const collectionName = pascalCase(collection.slug)
  const collectionTitle = titleCase(collection.slug)
  const collectionCamel = camelCase(collection.slug)
  const collectionSentence = sentenceCase(collection.slug)

  // Generate input fields based on collection fields
  const inputFields = collection.fields ? generateInputFields(collection.fields) : ''

  // Generate output fields based on collection fields
  const outputFields = collection.fields ? generateOutputFields(collection.fields) : ''

  return `// List ${collectionTitle} search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: \`\${bundle.authData.apiUrl}/api/${collection.slug}\`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    params: {
      limit: bundle.inputData.limit || 10,
      page: bundle.inputData.page || 1,
      where: JSON.stringify(buildWhereClause(bundle.inputData))
    }
  });

  return response.data.docs || [];
};

// Build the where clause for filtering
const buildWhereClause = (inputData) => {
  const where = {};
  
  // Add filters for each field if provided
  ${
    collection.fields
      ? collection.fields
          .filter((field) => typeof field === 'object' && 'name' in field && field.name && field.type)
          .map((field) => {
            const fieldName = field.name as string
            return `  if (inputData.${fieldName}) {
    where.${fieldName} = { equals: inputData.${fieldName} };
  }`
          })
          .join('\n  ')
      : '  // No fields to filter by'
  }
  
  return where;
};

module.exports = {
  key: 'find${collectionName}',
  noun: '${collectionTitle}',
  
  display: {
    label: 'Find ${collectionTitle}',
    description: 'Finds ${collectionSentence} in your account.'
  },
  
  operation: {
    perform,
    
    inputFields: [
      {
        key: 'limit',
        label: 'Limit',
        type: 'integer',
        required: false,
        default: 10,
        helpText: 'Maximum number of records to return'
      },
      {
        key: 'page',
        label: 'Page',
        type: 'integer',
        required: false,
        default: 1,
        helpText: 'Page number for pagination'
      },
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
