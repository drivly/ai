// Get Nouns for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/nouns/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getNouns',
  noun: 'Nouns',

  display: {
    label: 'Get Nouns',
    description: 'Gets a Nouns by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Nouns to retrieve',
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
        key: 'singular',
        label: 'Singular',
      },
      {
        key: 'plural',
        label: 'Plural',
      },
      {
        key: 'possessive',
        label: 'Possessive',
      },
      {
        key: 'pluralPossessive',
        label: 'PluralPossessive',
      },
      {
        key: 'verb',
        label: 'Verb',
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
        key: 'type',
        label: 'Type',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
