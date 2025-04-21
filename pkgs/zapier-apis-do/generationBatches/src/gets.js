// Get GenerationBatches for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/generationBatches/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getGenerationBatches',
  noun: 'GenerationBatches',

  display: {
    label: 'Get GenerationBatches',
    description: 'Gets a GenerationBatches by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the GenerationBatches to retrieve',
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
