// List Goals search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/goals`,
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
  if (inputData.title) {
    where.title = { equals: inputData.title }
  }
  if (inputData.object) {
    where.object = { equals: inputData.object }
  }
  if (inputData.keyResults) {
    where.keyResults = { equals: inputData.keyResults }
  }

  return where
}

module.exports = {
  key: 'findGoals',
  noun: 'Goals',

  display: {
    label: 'Find Goals',
    description: 'Finds Goals in your account.',
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
        key: 'title',
        label: 'Title',
        type: 'string',
        required: false,
        helpText: 'Filter by Title',
      },
      {
        key: 'object',
        label: 'Object',
        type: 'string',
        required: false,
        helpText: 'Filter by Object',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'title',
        label: 'Title',
      },
      {
        key: 'object',
        label: 'Object',
      },
      {
        key: 'keyResults',
        label: 'KeyResults',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
