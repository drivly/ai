// Update OauthClients for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthClients/${bundle.inputData.id}`,
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
  key: 'updateOauthClients',
  noun: 'OauthClients',

  display: {
    label: 'Update OauthClients',
    description: 'Updates an existing OauthClients.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the OauthClients to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the OauthClients',
      },
      {
        key: 'clientId',
        label: 'ClientId',
        type: 'string',
        required: false,
        helpText: 'The ClientId of the OauthClients',
      },
      {
        key: 'clientSecret',
        label: 'ClientSecret',
        type: 'string',
        required: false,
        helpText: 'The ClientSecret of the OauthClients',
      },
      {
        key: 'redirectURLs',
        label: 'RedirectURLs',
        type: 'string',
        required: false,
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
