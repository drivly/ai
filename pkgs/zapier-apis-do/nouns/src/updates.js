// Update Nouns for Zapier
const perform = async (z, bundle) => {
  // Remove id from the input data as it's in the URL
  const inputData = { ...bundle.inputData }
  delete inputData.id

  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/nouns/${bundle.inputData.id}`,
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
  key: 'updateNouns',
  noun: 'Nouns',

  display: {
    label: 'Update Nouns',
    description: 'Updates an existing Nouns.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Nouns to update',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Nouns',
      },
      {
        key: 'singular',
        label: 'Singular',
        type: 'string',
        required: false,
        helpText: 'The Singular of the Nouns',
      },
      {
        key: 'plural',
        label: 'Plural',
        type: 'string',
        required: false,
        helpText: 'The Plural of the Nouns',
      },
      {
        key: 'possessive',
        label: 'Possessive',
        type: 'string',
        required: false,
        helpText: 'The Possessive of the Nouns',
      },
      {
        key: 'pluralPossessive',
        label: 'PluralPossessive',
        type: 'string',
        required: false,
        helpText: 'The PluralPossessive of the Nouns',
      },
      {
        key: 'verb',
        label: 'Verb',
        type: 'string',
        required: false,
        helpText: 'The Verb of the Nouns',
      },
      {
        key: 'act',
        label: 'Act',
        type: 'string',
        required: false,
        helpText: 'The Act of the Nouns',
      },
      {
        key: 'activity',
        label: 'Activity',
        type: 'string',
        required: false,
        helpText: 'The Activity of the Nouns',
      },
      {
        key: 'event',
        label: 'Event',
        type: 'string',
        required: false,
        helpText: 'The Event of the Nouns',
      },
      {
        key: 'type',
        label: 'Type',
        type: 'string',
        required: false,
        helpText: 'The ID of the related things',
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
