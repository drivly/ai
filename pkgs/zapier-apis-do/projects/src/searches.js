// List Projects search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/projects`,
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
  if (inputData.domain) {
    where.domain = { equals: inputData.domain }
  }
  if (inputData.domains) {
    where.domains = { equals: inputData.domains }
  }

  return where
}

module.exports = {
  key: 'findProjects',
  noun: 'Projects',

  display: {
    label: 'Find Projects',
    description: 'Finds Projects in your account.',
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
        key: 'domain',
        label: 'Domain',
        type: 'string',
        required: false,
        helpText: 'Filter by Domain',
      },
      {
        key: 'domains',
        label: 'Domains',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related domains',
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
        key: 'domain',
        label: 'Domain',
      },
      {
        key: 'domains',
        label: 'Domains',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
