// Get OauthTokens for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthTokens/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getOauthTokens',
  noun: 'OauthTokens',

  display: {
    label: 'Get OauthTokens',
    description: 'Gets a OauthTokens by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the OauthTokens to retrieve',
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
