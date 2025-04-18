// List Functions search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/functions`,
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
  if (inputData.type) {
    where.type = { equals: inputData.type }
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
  if (inputData.format) {
    where.format = { equals: inputData.format }
  }
  if (inputData.schemaYaml) {
    where.schemaYaml = { equals: inputData.schemaYaml }
  }
  if (inputData.shape) {
    where.shape = { equals: inputData.shape }
  }
  if (inputData.code) {
    where.code = { equals: inputData.code }
  }
  if (inputData.prompt) {
    where.prompt = { equals: inputData.prompt }
  }
  if (inputData.role) {
    where.role = { equals: inputData.role }
  }
  if (inputData.user) {
    where.user = { equals: inputData.user }
  }
  if (inputData.agent) {
    where.agent = { equals: inputData.agent }
  }
  if (inputData.examples) {
    where.examples = { equals: inputData.examples }
  }

  return where
}

module.exports = {
  key: 'findFunctions',
  noun: 'Functions',

  display: {
    label: 'Find Functions',
    description: 'Finds Functions in your account.',
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
        helpText: 'Filter by the ID of the related functions',
      },
      {
        key: 'schemaYaml',
        label: 'SchemaYaml',
        type: 'string',
        required: false,
        helpText: 'Filter by SchemaYaml',
      },
      {
        key: 'code',
        label: 'Code',
        type: 'string',
        required: false,
        helpText: 'Filter by Code',
      },
      {
        key: 'prompt',
        label: 'Prompt',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related prompts',
      },
      {
        key: 'role',
        label: 'Role',
        type: 'string',
        required: false,
        helpText: 'Filter by Role',
      },
      {
        key: 'user',
        label: 'User',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related users',
      },
      {
        key: 'agent',
        label: 'Agent',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related agents',
      },
      {
        key: 'examples',
        label: 'Examples',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related resources',
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
      {
        key: 'schemaYaml',
        label: 'SchemaYaml',
      },
      {
        key: 'code',
        label: 'Code',
      },
      {
        key: 'prompt',
        label: 'Prompt',
      },
      {
        key: 'role',
        label: 'Role',
      },
      {
        key: 'user',
        label: 'User',
      },
      {
        key: 'agent',
        label: 'Agent',
      },
      {
        key: 'examples',
        label: 'Examples',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
