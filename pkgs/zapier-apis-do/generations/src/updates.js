// Update Generations for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/generations/${bundle.inputData.id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: inputData,
  })

  return response.data
}

module.exports = {
  key: 'updateGenerations',
  noun: 'Generations',

  display: {
    label: 'Update Generations',
    description: 'Updates an existing Generations.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Generations to update',
      },
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
