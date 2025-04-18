// List IntegrationActions search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/integrationActions`,
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
  if (inputData.displayName) {
    where.displayName = { equals: inputData.displayName }
  }
  if (inputData.description) {
    where.description = { equals: inputData.description }
  }
  if (inputData.appKey) {
    where.appKey = { equals: inputData.appKey }
  }
  if (inputData.appName) {
    where.appName = { equals: inputData.appName }
  }
  if (inputData.appId) {
    where.appId = { equals: inputData.appId }
  }
  if (inputData.version) {
    where.version = { equals: inputData.version }
  }
  if (inputData.parameters) {
    where.parameters = { equals: inputData.parameters }
  }
  if (inputData.response) {
    where.response = { equals: inputData.response }
  }

  return where
}

module.exports = {
  key: 'findIntegrationActions',
  noun: 'IntegrationActions',

  display: {
    label: 'Find IntegrationActions',
    description: 'Finds IntegrationActions in your account.',
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
        key: 'displayName',
        label: 'DisplayName',
        type: 'string',
        required: false,
        helpText: 'Filter by DisplayName',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'Filter by Description',
      },
      {
        key: 'appKey',
        label: 'AppKey',
        type: 'string',
        required: false,
        helpText: 'Filter by AppKey',
      },
      {
        key: 'appName',
        label: 'AppName',
        type: 'string',
        required: false,
        helpText: 'Filter by AppName',
      },
      {
        key: 'appId',
        label: 'AppId',
        type: 'string',
        required: false,
        helpText: 'Filter by AppId',
      },
      {
        key: 'version',
        label: 'Version',
        type: 'string',
        required: false,
        helpText: 'Filter by Version',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'displayName',
        label: 'DisplayName',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'appKey',
        label: 'AppKey',
      },
      {
        key: 'appName',
        label: 'AppName',
      },
      {
        key: 'appId',
        label: 'AppId',
      },
      {
        key: 'version',
        label: 'Version',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
