// Update OauthCodes for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthCodes/${bundle.inputData.id}`,
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
  key: 'updateOauthCodes',
  noun: 'OauthCodes',

  display: {
    label: 'Update OauthCodes',
    description: 'Updates an existing OauthCodes.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the OauthCodes to update',
      },
      {
        key: 'code',
        label: 'Code',
        type: 'string',
        required: false,
        helpText: 'The Code of the OauthCodes',
      },
      {
        key: 'provider',
        label: 'Provider',
        type: 'string',
        required: false,
        helpText: 'The Provider of the OauthCodes',
      },
      {
        key: 'redirectUri',
        label: 'RedirectUri',
        type: 'string',
        required: false,
        helpText: 'The RedirectUri of the OauthCodes',
      },
      {
        key: 'userId',
        label: 'UserId',
        type: 'string',
        required: false,
        helpText: 'The ID of the related users',
      },
      {
        key: 'expiresAt',
        label: 'ExpiresAt',
        type: 'string',
        required: false,
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
