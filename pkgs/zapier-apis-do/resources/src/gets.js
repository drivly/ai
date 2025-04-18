// Get Resources for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/resources/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getResources',
  noun: 'Resources',

  display: {
    label: 'Get Resources',
    description: 'Gets a Resources by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Resources to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'yaml',
        label: 'Yaml',
      },
      {
        key: 'subjectOf',
        label: 'SubjectOf',
      },
      {
        key: 'objectOf',
        label: 'ObjectOf',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
