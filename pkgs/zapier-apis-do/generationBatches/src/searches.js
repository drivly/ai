// List GenerationBatches search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/generationBatches`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      limit: bundle.inputData.limit || 10,
      page: bundle.inputData.page || 1,
      where: JSON.stringify(buildWhereClause(bundle.inputData)),
    },
  })

  return response.data.docs || []
}

// Build the where clause for filtering
const buildWhereClause = (inputData) => {
  const where = {}

  // Add filters for each field if provided
  if (inputData.name) {
    where.name = { equals: inputData.name }
  }
  if (inputData.provider) {
    where.provider = { equals: inputData.provider }
  }
  if (inputData.status) {
    where.status = { equals: inputData.status }
  }
  if (inputData.batchConfig) {
    where.batchConfig = { equals: inputData.batchConfig }
  }
  if (inputData.providerBatchId) {
    where.providerBatchId = { equals: inputData.providerBatchId }
  }
  if (inputData.generations) {
    where.generations = { equals: inputData.generations }
  }
  if (inputData.startedAt) {
    where.startedAt = { equals: inputData.startedAt }
  }
  if (inputData.completedAt) {
    where.completedAt = { equals: inputData.completedAt }
  }

  return where
}

module.exports = {
  key: 'findGenerationBatches',
  noun: 'GenerationBatches',

  display: {
    label: 'Find GenerationBatches',
    description: 'Finds GenerationBatches in your account.',
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
        helpText: 'Maximum number of records to return',
      },
      {
        key: 'page',
        label: 'Page',
        type: 'integer',
        required: false,
        default: 1,
        helpText: 'Page number for pagination',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'Filter by Name',
      },
      {
        key: 'providerBatchId',
        label: 'ProviderBatchId',
        type: 'string',
        required: false,
        helpText: 'Filter by ProviderBatchId',
      },
      {
        key: 'generations',
        label: 'Generations',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related generations',
      },
      {
        key: 'startedAt',
        label: 'StartedAt',
        type: 'string',
        required: false,
        helpText: 'Filter by StartedAt',
      },
      {
        key: 'completedAt',
        label: 'CompletedAt',
        type: 'string',
        required: false,
        helpText: 'Filter by CompletedAt',
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
