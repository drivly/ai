// Update Apikeys for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/apikeys/${bundle.inputData.id}`,
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
  key: 'updateApikeys',
  noun: 'Apikeys',

  display: {
    label: 'Update Apikeys',
    description: 'Updates an existing Apikeys.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Apikeys to update',
      },
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
