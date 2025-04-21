// List OauthTokens search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthTokens`,
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
  if (inputData.token) {
    where.token = { equals: inputData.token }
  }
  if (inputData.provider) {
    where.provider = { equals: inputData.provider }
  }
  if (inputData.userId) {
    where.userId = { equals: inputData.userId }
  }
  if (inputData.clientId) {
    where.clientId = { equals: inputData.clientId }
  }
  if (inputData.expiresAt) {
    where.expiresAt = { equals: inputData.expiresAt }
  }
  if (inputData.scope) {
    where.scope = { equals: inputData.scope }
  }

  return where
}

module.exports = {
  key: 'findOauthTokens',
  noun: 'OauthTokens',

  display: {
    label: 'Find OauthTokens',
    description: 'Finds OauthTokens in your account.',
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
        key: 'token',
        label: 'Token',
        type: 'string',
        required: false,
        helpText: 'Filter by Token',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: false,
        helpText: 'Filter by Provider',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related users',
      },
      {
        key: 'clientId',
        label: 'ClientId',
        type: 'string',
        required: false,
        helpText: 'Filter by ClientId',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
        type: 'string',
        required: false,
        helpText: 'Filter by ExpiresAt',
      },
      {
        key: 'scope',
        label: 'Scope',
        type: 'string',
        required: false,
        helpText: 'Filter by Scope',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'token',
        label: 'Token',
      },
      {
        key: 'provider',
        label: 'Provider',
      },
      {
        key: 'userId',
        label: 'UserId',
      },
      {
        key: 'clientId',
        label: 'ClientId',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
      },
      {
        key: 'scope',
        label: 'Scope',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
