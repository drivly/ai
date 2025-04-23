// Create Generations for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/generations`,
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
  key: 'createGenerations',
  noun: 'Generations',

  display: {
    label: 'Create Generations',
    description: 'Creates a new Generations.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'action',
        label: 'Action',
        type: 'string',
        required: false,
        helpText: 'The ID of the related actions',
      },
      {
        key: 'settings',
        label: 'Settings',
        type: 'string',
        required: false,
        helpText: 'The ID of the related resources',
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'number',
        required: false,
        helpText: 'The Duration of the Generations',
      },
      {
        key: 'batch',
        label: 'Batch',
        type: 'string',
        required: false,
        helpText: 'The ID of the related generationBatches',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'action',
        label: 'Action',
      },
      {
        key: 'settings',
        label: 'Settings',
      },
      {
        key: 'duration',
        label: 'Duration',
      },
      {
        key: 'batch',
        label: 'Batch',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
