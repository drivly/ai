// Create Providers for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/providers`,
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
  key: 'createProviders',
  noun: 'Providers',

  display: {
    label: 'Create Providers',
    description: 'Creates a new Providers.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the Providers',
      },
      {
        key: 'id',
        label: 'Id',
        type: 'string',
        required: true,
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
