// Create Resources for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/resources`,
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
  key: 'createResources',
  noun: 'Resources',

  display: {
    label: 'Create Resources',
    description: 'Creates a new Resources.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'yaml',
        label: 'Yaml',
        type: 'string',
        required: false,
        helpText: 'The Yaml of the Resources',
      },
      {
        key: 'subjectOf',
        label: 'SubjectOf',
        type: 'string',
        required: false,
        helpText: 'The ID of the related actions',
      },
      {
        key: 'objectOf',
        label: 'ObjectOf',
        type: 'string',
        required: false,
        helpText: 'The ID of the related actions',
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
