// List Agents search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/agents`,
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
  if (inputData.public) {
    where.public = { equals: inputData.public }
  }
  if (inputData.clonedFrom) {
    where.clonedFrom = { equals: inputData.clonedFrom }
  }
  if (inputData.pricing) {
    where.pricing = { equals: inputData.pricing }
  }

  return where
}

module.exports = {
  key: 'findAgents',
  noun: 'Agents',

  display: {
    label: 'Find Agents',
    description: 'Finds Agents in your account.',
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
        key: 'clonedFrom',
        label: 'ClonedFrom',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related agents',
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
        key: 'public',
        label: 'Public',
      },
      {
        key: 'clonedFrom',
        label: 'ClonedFrom',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
