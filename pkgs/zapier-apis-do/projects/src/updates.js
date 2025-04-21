// Update Projects for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/projects/${bundle.inputData.id}`,
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
  key: 'updateProjects',
  noun: 'Projects',

  display: {
    label: 'Update Projects',
    description: 'Updates an existing Projects.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Projects to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Projects',
      },
      {
        key: 'domain',
        label: 'Domain',
        type: 'string',
        required: false,
        helpText: 'The Domain of the Projects',
      },
      {
        key: 'domains',
        label: 'Domains',
        type: 'string',
        required: false,
        helpText: 'The ID of the related domains',
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
        key: 'domains',
        label: 'Domains',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
