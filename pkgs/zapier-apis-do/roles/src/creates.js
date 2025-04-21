// Create Roles for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/roles`,
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
  key: 'createRoles',
  noun: 'Roles',

  display: {
    label: 'Create Roles',
    description: 'Creates a new Roles.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the Roles',
      },
      {
        key: 'superAdmin',
        label: 'SuperAdmin',
        type: 'boolean',
        required: false,
        helpText: 'The SuperAdmin of the Roles',
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
        key: 'superAdmin',
        label: 'SuperAdmin',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
