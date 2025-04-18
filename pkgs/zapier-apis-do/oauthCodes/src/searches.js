// List OauthCodes search for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthCodes`,
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
  if (inputData.code) {
    where.code = { equals: inputData.code }
  }
  if (inputData.provider) {
    where.provider = { equals: inputData.provider }
  }
  if (inputData.redirectUri) {
    where.redirectUri = { equals: inputData.redirectUri }
  }
  if (inputData.userId) {
    where.userId = { equals: inputData.userId }
  }
  if (inputData.expiresAt) {
    where.expiresAt = { equals: inputData.expiresAt }
  }
  if (inputData.used) {
    where.used = { equals: inputData.used }
  }

  return where
}

module.exports = {
  key: 'findOauthCodes',
  noun: 'OauthCodes',

  display: {
    label: 'Find OauthCodes',
    description: 'Finds OauthCodes in your account.',
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
        key: 'code',
        label: 'Code',
        type: 'string',
        required: false,
        helpText: 'Filter by Code',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: false,
        helpText: 'Filter by Provider',
      },
      {
        key: 'redirectUri',
        label: 'RedirectUri',
        type: 'string',
        required: false,
        helpText: 'Filter by RedirectUri',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: false,
        helpText: 'Filter by the ID of the related users',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
        type: 'string',
        required: false,
        helpText: 'Filter by ExpiresAt',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'code',
        label: 'Code',
      },
      {
        key: 'provider',
        label: 'Provider',
      },
      {
        key: 'redirectUri',
        label: 'RedirectUri',
      },
      {
        key: 'userId',
        label: 'UserId',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
      },
      {
        key: 'used',
        label: 'Used',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
