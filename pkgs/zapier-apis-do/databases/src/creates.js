// Create Databases for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/databases`,
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
  key: 'createDatabases',
  noun: 'Databases',

  display: {
    label: 'Create Databases',
    description: 'Creates a new Databases.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the Databases',
      },
      {
        key: 'domain',
        label: 'Domain',
        type: 'string',
        required: true,
        helpText: 'The Domain of the Databases',
      },
      {
        key: 'nouns',
        label: 'Nouns',
        type: 'string',
        required: false,
        helpText: 'The ID of the related nouns',
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
        key: 'domain',
        label: 'Domain',
      },
      {
        key: 'nouns',
        label: 'Nouns',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
