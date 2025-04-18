// Create GenerationBatches for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/generationBatches`,
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
  key: 'createGenerationBatches',
  noun: 'GenerationBatches',

  display: {
    label: 'Create GenerationBatches',
    description: 'Creates a new GenerationBatches.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
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
