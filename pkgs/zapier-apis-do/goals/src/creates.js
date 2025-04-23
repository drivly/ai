// Create Goals for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/goals`,
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
  key: 'createGoals',
  noun: 'Goals',

  display: {
    label: 'Create Goals',
    description: 'Creates a new Goals.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'title',
        label: 'Title',
        type: 'string',
        required: true,
        helpText: 'The Title of the Goals',
      },
      {
        key: 'object',
        label: 'Object',
        type: 'string',
        required: true,
        helpText: 'The Object of the Goals',
      },
      {
        key: 'keyResults',
        label: 'KeyResults',
        type: 'string',
        required: true,
        helpText: 'JSON array of keyResults items',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'title',
        label: 'Title',
      },
      {
        key: 'object',
        label: 'Object',
      },
      {
        key: 'keyResults',
        label: 'KeyResults',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
