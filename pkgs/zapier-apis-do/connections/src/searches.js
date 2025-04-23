// List Connections search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/connections`,
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
  if (inputData.user) {
    where.user = { equals: inputData.user }
  }
  if (inputData.integration) {
    where.integration = { equals: inputData.integration }
  }
  if (inputData.status) {
    where.status = { equals: inputData.status }
  }
  if (inputData.metadata) {
    where.metadata = { equals: inputData.metadata }
  }

  return where
}

module.exports = {
  key: 'findConnections',
  noun: 'Connections',

  display: {
    label: 'Find Connections',
    description: 'Finds Connections in your account.',
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
        key: 'user',
        label: 'User',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related users',
      },
      {
        key: 'integration',
        label: 'Integration',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related integrations',
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
        key: 'user',
        label: 'User',
      },
      {
        key: 'integration',
        label: 'Integration',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
