// Update GenerationBatches for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/generationBatches/${bundle.inputData.id}`,
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
  key: 'updateGenerationBatches',
  noun: 'GenerationBatches',

  display: {
    label: 'Update GenerationBatches',
    description: 'Updates an existing GenerationBatches.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the GenerationBatches to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the GenerationBatches',
      },
      {
        key: 'providerBatchId',
        label: 'ProviderBatchId',
        type: 'string',
        required: false,
        helpText: 'The ProviderBatchId of the GenerationBatches',
      },
      {
        key: 'generations',
        label: 'Generations',
        type: 'string',
        required: false,
        helpText: 'The ID of the related generations',
      },
      {
        key: 'startedAt',
        label: 'StartedAt',
        type: 'string',
        required: false,
        helpText: 'The StartedAt of the GenerationBatches',
      },
      {
        key: 'completedAt',
        label: 'CompletedAt',
        type: 'string',
        required: false,
        helpText: 'The CompletedAt of the GenerationBatches',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'providerBatchId',
        label: 'ProviderBatchId',
      },
      {
        key: 'generations',
        label: 'Generations',
      },
      {
        key: 'startedAt',
        label: 'StartedAt',
      },
      {
        key: 'completedAt',
        label: 'CompletedAt',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
