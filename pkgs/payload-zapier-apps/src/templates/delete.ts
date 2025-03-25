import { ZapierCollectionConfig } from '../types/collection'
import { pascalCase, titleCase, sentenceCase } from '../utils/stringUtils'

/**
 * Generates the deletes.js file for a Zapier app
 * @param collection The collection to generate the deletes for
 * @returns The content of the deletes.js file
 */
export function generateDeleteTemplate(collection: ZapierCollectionConfig): string {
  const collectionName = pascalCase(collection.slug)
  const collectionTitle = titleCase(collection.slug)
  const collectionSentence = sentenceCase(collection.slug)

  return `// Delete ${collectionTitle} for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: \`\${bundle.authData.apiUrl}/api/${collection.slug}/\${bundle.inputData.id}\`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  return response.data;
};

module.exports = {
  key: 'delete${collectionName}',
  noun: '${collectionTitle}',
  
  display: {
    label: 'Delete ${collectionTitle}',
    description: 'Deletes a ${collectionSentence}.'
  },
  
  operation: {
    perform,
    
    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the ${collectionSentence} to delete'
      }
    ],
    
    sample: {
      id: 'sample-id-1234',
      deleted: true
    }
  }
};
`
}
