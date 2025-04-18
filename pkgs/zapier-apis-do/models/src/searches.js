// List Models search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/models`,
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
  if (inputData.id) {
    where.id = { equals: inputData.id }
  }
  if (inputData.provider) {
    where.provider = { equals: inputData.provider }
  }
  if (inputData.lab) {
    where.lab = { equals: inputData.lab }
  }
  if (inputData.description) {
    where.description = { equals: inputData.description }
  }
  if (inputData.context_length) {
    where.context_length = { equals: inputData.context_length }
  }
  if (inputData.pricing) {
    where.pricing = { equals: inputData.pricing }
  }
  if (inputData.capabilities) {
    where.capabilities = { equals: inputData.capabilities }
  }
  if (inputData.modelUrl) {
    where.modelUrl = { equals: inputData.modelUrl }
  }
  if (inputData.imageUrl) {
    where.imageUrl = { equals: inputData.imageUrl }
  }

  return where
}

module.exports = {
  key: 'findModels',
  noun: 'Models',

  display: {
    label: 'Find Models',
    description: 'Finds Models in your account.',
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
        key: 'id',
        label: 'Id',
        type: 'string',
        required: false,
        helpText: 'Filter by Id',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related providers',
      },
      {
        key: 'lab',
        label: 'Lab',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related labs',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'Filter by Description',
      },
      {
        key: 'context_length',
        label: 'Context Length',
        type: 'number',
        required: false,
        helpText: 'Filter by Context length',
      },
      {
        key: 'modelUrl',
        label: 'ModelUrl',
        type: 'string',
        required: false,
        helpText: 'Filter by ModelUrl',
      },
      {
        key: 'imageUrl',
        label: 'ImageUrl',
        type: 'string',
        required: false,
        helpText: 'Filter by ImageUrl',
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
        key: 'id',
        label: 'Id',
      },
      {
        key: 'provider',
        label: 'Provider',
      },
      {
        key: 'lab',
        label: 'Lab',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'context_length',
        label: 'Context Length',
      },
      {
        key: 'capabilities',
        label: 'Capabilities',
      },
      {
        key: 'modelUrl',
        label: 'ModelUrl',
      },
      {
        key: 'imageUrl',
        label: 'ImageUrl',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
