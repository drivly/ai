// List Errors search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/errors`,
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
  if (inputData.message) {
    where.message = { equals: inputData.message }
  }
  if (inputData.stack) {
    where.stack = { equals: inputData.stack }
  }
  if (inputData.digest) {
    where.digest = { equals: inputData.digest }
  }
  if (inputData.url) {
    where.url = { equals: inputData.url }
  }
  if (inputData.source) {
    where.source = { equals: inputData.source }
  }

  return where
}

module.exports = {
  key: 'findErrors',
  noun: 'Errors',

  display: {
    label: 'Find Errors',
    description: 'Finds Errors in your account.',
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
        key: 'message',
        label: 'Message',
        type: 'string',
        required: false,
        helpText: 'Filter by Message',
      },
      {
        key: 'stack',
        label: 'Stack',
        type: 'string',
        required: false,
        helpText: 'Filter by Stack',
      },
      {
        key: 'digest',
        label: 'Digest',
        type: 'string',
        required: false,
        helpText: 'Filter by Digest',
      },
      {
        key: 'url',
        label: 'Url',
        type: 'string',
        required: false,
        helpText: 'Filter by Url',
      },
      {
        key: 'source',
        label: 'Source',
        type: 'string',
        required: false,
        helpText: 'Filter by Source',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'message',
        label: 'Message',
      },
      {
        key: 'stack',
        label: 'Stack',
      },
      {
        key: 'digest',
        label: 'Digest',
      },
      {
        key: 'url',
        label: 'Url',
      },
      {
        key: 'source',
        label: 'Source',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
