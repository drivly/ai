// List Generations search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/generations`,
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
  if (inputData.action) {
    where.action = { equals: inputData.action }
  }
  if (inputData.settings) {
    where.settings = { equals: inputData.settings }
  }
  if (inputData.request) {
    where.request = { equals: inputData.request }
  }
  if (inputData.response) {
    where.response = { equals: inputData.response }
  }
  if (inputData.error) {
    where.error = { equals: inputData.error }
  }
  if (inputData.status) {
    where.status = { equals: inputData.status }
  }
  if (inputData.duration) {
    where.duration = { equals: inputData.duration }
  }
  if (inputData.processingMode) {
    where.processingMode = { equals: inputData.processingMode }
  }
  if (inputData.batch) {
    where.batch = { equals: inputData.batch }
  }

  return where
}

module.exports = {
  key: 'findGenerations',
  noun: 'Generations',

  display: {
    label: 'Find Generations',
    description: 'Finds Generations in your account.',
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
        key: 'action',
        label: 'Action',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related actions',
      },
      {
        key: 'settings',
        label: 'Settings',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related resources',
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'number',
        required: false,
        helpText: 'Filter by Duration',
      },
      {
        key: 'batch',
        label: 'Batch',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related generationBatches',
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
