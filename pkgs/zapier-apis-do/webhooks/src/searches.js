// List Webhooks search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/webhooks`,
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
  if (inputData.url) {
    where.url = { equals: inputData.url }
  }
  if (inputData.filters) {
    where.filters = { equals: inputData.filters }
  }
  if (inputData.enabled) {
    where.enabled = { equals: inputData.enabled }
  }
  if (inputData.secret) {
    where.secret = { equals: inputData.secret }
  }

  return where
}

module.exports = {
  key: 'findWebhooks',
  noun: 'Webhooks',

  display: {
    label: 'Find Webhooks',
    description: 'Finds Webhooks in your account.',
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
        key: 'url',
        label: 'Url',
        type: 'string',
        required: false,
        helpText: 'Filter by Url',
      },
      {
        key: 'secret',
        label: 'Secret',
        type: 'string',
        required: false,
        helpText: 'Filter by Secret',
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
        key: 'url',
        label: 'Url',
      },
      {
        key: 'filters',
        label: 'Filters',
      },
      {
        key: 'enabled',
        label: 'Enabled',
      },
      {
        key: 'secret',
        label: 'Secret',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
