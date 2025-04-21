// Update Providers for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/providers/${bundle.inputData.id}`,
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
  key: 'updateProviders',
  noun: 'Providers',

  display: {
    label: 'Update Providers',
    description: 'Updates an existing Providers.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Providers to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Providers',
      },
      {
        key: 'id',
        label: 'Id',
        type: 'string',
        required: false,
        helpText: 'The Id of the Providers',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the Providers',
      },
      {
        key: 'website',
        label: 'Website',
        type: 'string',
        required: false,
        helpText: 'The Website of the Providers',
      },
      {
        key: 'logoUrl',
        label: 'LogoUrl',
        type: 'string',
        required: false,
        helpText: 'The LogoUrl of the Providers',
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
        key: 'id',
        label: 'Id',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'website',
        label: 'Website',
      },
      {
        key: 'logoUrl',
        label: 'LogoUrl',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
