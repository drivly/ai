// List Actions search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/actions`,
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
  if (inputData.subject) {
    where.subject = { equals: inputData.subject }
  }
  if (inputData.verb) {
    where.verb = { equals: inputData.verb }
  }
  if (inputData.object) {
    where.object = { equals: inputData.object }
  }
  if (inputData.hash) {
    where.hash = { equals: inputData.hash }
  }
  if (inputData.generation) {
    where.generation = { equals: inputData.generation }
  }

  return where
}

module.exports = {
  key: 'findActions',
  noun: 'Actions',

  display: {
    label: 'Find Actions',
    description: 'Finds Actions in your account.',
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
        key: 'subject',
        label: 'Subject',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related resources',
      },
      {
        key: 'verb',
        label: 'Verb',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related verbs',
      },
      {
        key: 'object',
        label: 'Object',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related resources',
      },
      {
        key: 'hash',
        label: 'Hash',
        type: 'string',
        required: false,
        helpText: 'Filter by Hash',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'subject',
        label: 'Subject',
      },
      {
        key: 'verb',
        label: 'Verb',
      },
      {
        key: 'object',
        label: 'Object',
      },
      {
        key: 'hash',
        label: 'Hash',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
