// List Domains search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/domains`,
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
  if (inputData.project) {
    where.project = { equals: inputData.project }
  }
  if (inputData.status) {
    where.status = { equals: inputData.status }
  }
  if (inputData.hostnames) {
    where.hostnames = { equals: inputData.hostnames }
  }
  if (inputData.vercelId) {
    where.vercelId = { equals: inputData.vercelId }
  }
  if (inputData.cloudflareId) {
    where.cloudflareId = { equals: inputData.cloudflareId }
  }
  if (inputData.errorMessage) {
    where.errorMessage = { equals: inputData.errorMessage }
  }

  return where
}

module.exports = {
  key: 'findDomains',
  noun: 'Domains',

  display: {
    label: 'Find Domains',
    description: 'Finds Domains in your account.',
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
        key: 'project',
        label: 'Project',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related projects',
      },
      {
        key: 'vercelId',
        label: 'VercelId',
        type: 'string',
        required: false,
        helpText: 'Filter by VercelId',
      },
      {
        key: 'cloudflareId',
        label: 'CloudflareId',
        type: 'string',
        required: false,
        helpText: 'Filter by CloudflareId',
      },
      {
        key: 'errorMessage',
        label: 'ErrorMessage',
        type: 'string',
        required: false,
        helpText: 'Filter by ErrorMessage',
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
        key: 'project',
        label: 'Project',
      },
      {
        key: 'hostnames',
        label: 'Hostnames',
      },
      {
        key: 'vercelId',
        label: 'VercelId',
      },
      {
        key: 'cloudflareId',
        label: 'CloudflareId',
      },
      {
        key: 'errorMessage',
        label: 'ErrorMessage',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
