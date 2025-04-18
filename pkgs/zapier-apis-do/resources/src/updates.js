// Update Resources for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/resources/${bundle.inputData.id}`,
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
  key: 'updateResources',
  noun: 'Resources',

  display: {
    label: 'Update Resources',
    description: 'Updates an existing Resources.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Resources to update',
      },
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
