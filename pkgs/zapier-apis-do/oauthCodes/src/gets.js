// Get OauthCodes for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthCodes/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getOauthCodes',
  noun: 'OauthCodes',

  display: {
    label: 'Get OauthCodes',
    description: 'Gets a OauthCodes by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the OauthCodes to retrieve',
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
