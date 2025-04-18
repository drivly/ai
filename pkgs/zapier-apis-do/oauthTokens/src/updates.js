// Update OauthTokens for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthTokens/${bundle.inputData.id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: inputData,
  })

  return response.data
}

module.exports = {
  key: 'updateOauthTokens',
  noun: 'OauthTokens',

  display: {
    label: 'Update OauthTokens',
    description: 'Updates an existing OauthTokens.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the OauthTokens to update',
      },
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        required: false,
        helpText: 'The Token of the OauthTokens',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: false,
        helpText: 'The Provider of the OauthTokens',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: false,
        helpText: 'The ID of the related users',
      },
      {
        key: 'clientId',
        label: 'ClientId',
        type: 'string',
        required: false,
        helpText: 'The ClientId of the OauthTokens',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
        type: 'string',
        required: false,
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
