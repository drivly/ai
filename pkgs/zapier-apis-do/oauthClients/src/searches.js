// List OauthClients search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthClients`,
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
  if (inputData.clientId) {
    where.clientId = { equals: inputData.clientId }
  }
  if (inputData.clientSecret) {
    where.clientSecret = { equals: inputData.clientSecret }
  }
  if (inputData.redirectURLs) {
    where.redirectURLs = { equals: inputData.redirectURLs }
  }
  if (inputData.disabled) {
    where.disabled = { equals: inputData.disabled }
  }
  if (inputData.createdBy) {
    where.createdBy = { equals: inputData.createdBy }
  }

  return where
}

module.exports = {
  key: 'findOauthClients',
  noun: 'OauthClients',

  display: {
    label: 'Find OauthClients',
    description: 'Finds OauthClients in your account.',
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
        key: 'clientId',
        label: 'ClientId',
        type: 'string',
        required: false,
        helpText: 'Filter by ClientId',
      },
      {
        key: 'clientSecret',
        label: 'ClientSecret',
        type: 'string',
        required: false,
        helpText: 'Filter by ClientSecret',
      },
      {
        key: 'createdBy',
        label: 'CreatedBy',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related users',
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
        key: 'clientId',
        label: 'ClientId',
      },
      {
        key: 'clientSecret',
        label: 'ClientSecret',
      },
      {
        key: 'redirectURLs',
        label: 'RedirectURLs',
      },
      {
        key: 'disabled',
        label: 'Disabled',
      },
      {
        key: 'createdBy',
        label: 'CreatedBy',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
