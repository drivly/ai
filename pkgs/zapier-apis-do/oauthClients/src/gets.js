// Get OauthClients for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/oauthClients/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getOauthClients',
  noun: 'OauthClients',

  display: {
    label: 'Get OauthClients',
    description: 'Gets a OauthClients by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the OauthClients to retrieve',
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
