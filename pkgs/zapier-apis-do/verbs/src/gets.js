// Get Verbs for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/verbs/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getVerbs',
  noun: 'Verbs',

  display: {
    label: 'Get Verbs',
    description: 'Gets a Verbs by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Verbs to retrieve',
      },
    ],

    outputFields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'action',
        label: 'Action',
      },
      {
        key: 'act',
        label: 'Act',
      },
      {
        key: 'activity',
        label: 'Activity',
      },
      {
        key: 'event',
        label: 'Event',
      },
      {
        key: 'subject',
        label: 'Subject',
      },
      {
        key: 'object',
        label: 'Object',
      },
      {
        key: 'inverse',
        label: 'Inverse',
      },
      {
        key: 'inverseAct',
        label: 'InverseAct',
      },
      {
        key: 'inverseActivity',
        label: 'InverseActivity',
      },
      {
        key: 'inverseEvent',
        label: 'InverseEvent',
      },
      {
        key: 'inverseSubject',
        label: 'InverseSubject',
      },
      {
        key: 'inverseObject',
        label: 'InverseObject',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
