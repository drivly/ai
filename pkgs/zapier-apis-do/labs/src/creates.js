// Create Labs for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/labs`,
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
  key: 'createLabs',
  noun: 'Labs',

  display: {
    label: 'Create Labs',
    description: 'Creates a new Labs.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the Labs',
      },
      {
        key: 'id',
        label: 'Id',
        type: 'string',
        required: true,
        helpText: 'The Id of the Labs',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        helpText: 'The Description of the Labs',
      },
      {
        key: 'website',
        label: 'Website',
        type: 'string',
        required: false,
        helpText: 'The Website of the Labs',
      },
      {
        key: 'logoUrl',
        label: 'LogoUrl',
        type: 'string',
        required: false,
        helpText: 'The LogoUrl of the Labs',
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
