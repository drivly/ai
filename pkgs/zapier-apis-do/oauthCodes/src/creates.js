// Create OauthCodes for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthCodes`,
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
  key: 'createOauthCodes',
  noun: 'OauthCodes',

  display: {
    label: 'Create OauthCodes',
    description: 'Creates a new OauthCodes.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'code',
        label: 'Code',
        type: 'string',
        required: true,
        helpText: 'The Code of the OauthCodes',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: true,
        helpText: 'The Provider of the OauthCodes',
      },
      {
        key: 'redirectUri',
        label: 'RedirectUri',
        type: 'string',
        required: true,
        helpText: 'The RedirectUri of the OauthCodes',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: true,
        helpText: 'The ID of the related users',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
        type: 'string',
        required: true,
        helpText: 'The ExpiresAt of the OauthCodes',
      },
      {
        key: 'used',
        label: 'Used',
        type: 'boolean',
        required: false,
        helpText: 'The Used of the OauthCodes',
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
