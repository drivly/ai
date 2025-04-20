// Create Apikeys for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/apikeys`,
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
  key: 'createApikeys',
  noun: 'Apikeys',

  display: {
    label: 'Create Apikeys',
    description: 'Creates a new Apikeys.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Apikeys',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'string',
        required: false,
        helpText: 'The Email of the Apikeys',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the Apikeys',
      },
      {
        key: 'url',
        label: 'Url',
        type: 'string',
        required: false,
        helpText: 'The Url of the Apikeys',
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
        key: 'email',
        label: 'Email',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'url',
        label: 'Url',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
