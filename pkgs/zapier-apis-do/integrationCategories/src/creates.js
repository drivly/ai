// Create IntegrationCategories for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/integrationCategories`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: bundle.inputData,
  })

  return response.data
}

module.exports = {
  key: 'createIntegrationCategories',
  noun: 'IntegrationCategories',

  display: {
    label: 'Create IntegrationCategories',
    description: 'Creates a new IntegrationCategories.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'category',
        label: 'Category',
        type: 'string',
        required: false,
        helpText: 'The Category of the IntegrationCategories',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'category',
        label: 'Category',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
