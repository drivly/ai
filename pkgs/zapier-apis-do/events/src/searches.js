// List Events search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/events`,
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
  if (inputData.type) {
    where.type = { equals: inputData.type }
  }
  if (inputData.source) {
    where.source = { equals: inputData.source }
  }
  if (inputData.subject) {
    where.subject = { equals: inputData.subject }
  }
  if (inputData.data) {
    where.data = { equals: inputData.data }
  }
  if (inputData.metadata) {
    where.metadata = { equals: inputData.metadata }
  }
  if (inputData.action) {
    where.action = { equals: inputData.action }
  }
  if (inputData.trigger) {
    where.trigger = { equals: inputData.trigger }
  }
  if (inputData.search) {
    where.search = { equals: inputData.search }
  }
  if (inputData.function) {
    where.function = { equals: inputData.function }
  }
  if (inputData.workflow) {
    where.workflow = { equals: inputData.workflow }
  }
  if (inputData.agent) {
    where.agent = { equals: inputData.agent }
  }
  if (inputData.generations) {
    where.generations = { equals: inputData.generations }
  }

  return where
}

module.exports = {
  key: 'findEvents',
  noun: 'Events',

  display: {
    label: 'Find Events',
    description: 'Finds Events in your account.',
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
        key: 'type',
        label: 'Type',
        type: 'string',
        required: false,
        helpText: 'Filter by Type',
      },
      {
        key: 'source',
        label: 'Source',
        type: 'string',
        required: false,
        helpText: 'Filter by Source',
      },
      {
        key: 'subject',
        label: 'Subject',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related resources',
      },
      {
        key: 'action',
        label: 'Action',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related actions',
      },
      {
        key: 'trigger',
        label: 'Trigger',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related triggers',
      },
      {
        key: 'search',
        label: 'Search',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related searches',
      },
      {
        key: 'function',
        label: 'Function',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related functions',
      },
      {
        key: 'workflow',
        label: 'Workflow',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related workflows',
      },
      {
        key: 'agent',
        label: 'Agent',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related agents',
      },
      {
        key: 'generations',
        label: 'Generations',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related generations',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'type',
        label: 'Type',
      },
      {
        key: 'source',
        label: 'Source',
      },
      {
        key: 'subject',
        label: 'Subject',
      },
      {
        key: 'action',
        label: 'Action',
      },
      {
        key: 'trigger',
        label: 'Trigger',
      },
      {
        key: 'search',
        label: 'Search',
      },
      {
        key: 'function',
        label: 'Function',
      },
      {
        key: 'workflow',
        label: 'Workflow',
      },
      {
        key: 'agent',
        label: 'Agent',
      },
      {
        key: 'generations',
        label: 'Generations',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
