// Create Users for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/users`,
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
  key: 'createUsers',
  noun: 'Users',

  display: {
    label: 'Create Users',
    description: 'Creates a new Users.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'roles',
        label: 'Roles',
        type: 'string',
        required: false,
        helpText: 'The ID of the related roles',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'roles',
        label: 'Roles',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
