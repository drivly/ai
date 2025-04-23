// Create OauthClients for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthClients`,
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
  key: 'createOauthClients',
  noun: 'OauthClients',

  display: {
    label: 'Create OauthClients',
    description: 'Creates a new OauthClients.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the OauthClients',
      },
      {
        key: 'clientId',
        label: 'ClientId',
        type: 'string',
        required: true,
        helpText: 'The ClientId of the OauthClients',
      },
      {
        key: 'clientSecret',
        label: 'ClientSecret',
        type: 'string',
        required: true,
        helpText: 'The ClientSecret of the OauthClients',
      },
      {
        key: 'redirectURLs',
        label: 'RedirectURLs',
        type: 'string',
        required: true,
        helpText: 'JSON array of redirectURLs items',
      },
      {
        key: 'disabled',
        label: 'Disabled',
        type: 'boolean',
        required: false,
        helpText: 'The Disabled of the OauthClients',
      },
      {
        key: 'createdBy',
        label: 'CreatedBy',
        type: 'string',
        required: false,
        helpText: 'The ID of the related users',
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
