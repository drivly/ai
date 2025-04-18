// Create OauthTokens for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthTokens`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: bundle.inputData,
  })

  return response.data
}

module.exports = {
  key: 'createOauthTokens',
  noun: 'OauthTokens',

  display: {
    label: 'Create OauthTokens',
    description: 'Creates a new OauthTokens.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        required: true,
        helpText: 'The Token of the OauthTokens',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: true,
        helpText: 'The Provider of the OauthTokens',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: true,
        helpText: 'The ID of the related users',
      },
      {
        key: 'clientId',
        label: 'ClientId',
        type: 'string',
        required: true,
        helpText: 'The ClientId of the OauthTokens',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
        type: 'string',
        required: true,
        helpText: 'The ExpiresAt of the OauthTokens',
      },
      {
        key: 'scope',
        label: 'Scope',
        type: 'string',
        required: false,
        helpText: 'The Scope of the OauthTokens',
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
