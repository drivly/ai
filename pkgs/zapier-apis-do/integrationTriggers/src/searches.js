// List IntegrationTriggers search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/integrationTriggers`,
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
  if (inputData.logo) {
    where.logo = { equals: inputData.logo }
  }
  if (inputData.payload) {
    where.payload = { equals: inputData.payload }
  }
  if (inputData.config) {
    where.config = { equals: inputData.config }
  }

  return where
}

module.exports = {
  key: 'findIntegrationTriggers',
  noun: 'IntegrationTriggers',

  display: {
    label: 'Find IntegrationTriggers',
    description: 'Finds IntegrationTriggers in your account.',
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
        key: 'logo',
        label: 'Logo',
        type: 'string',
        required: false,
        helpText: 'Filter by Logo',
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
        key: 'logo',
        label: 'Logo',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
