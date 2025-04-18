// Create Things for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/things`,
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
  key: 'createThings',
  noun: 'Things',

  display: {
    label: 'Create Things',
    description: 'Creates a new Things.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
        helpText: 'The Name of the Things',
      },
      {
        key: 'singular',
        label: 'Singular',
        type: 'string',
        required: false,
        helpText: 'The Singular of the Things',
      },
      {
        key: 'plural',
        label: 'Plural',
        type: 'string',
        required: false,
        helpText: 'The Plural of the Things',
      },
      {
        key: 'possessive',
        label: 'Possessive',
        type: 'string',
        required: false,
        helpText: 'The Possessive of the Things',
      },
      {
        key: 'pluralPossessive',
        label: 'PluralPossessive',
        type: 'string',
        required: false,
        helpText: 'The PluralPossessive of the Things',
      },
      {
        key: 'verb',
        label: 'Verb',
        type: 'string',
        required: false,
        helpText: 'The Verb of the Things',
      },
      {
        key: 'act',
        label: 'Act',
        type: 'string',
        required: false,
        helpText: 'The Act of the Things',
      },
      {
        key: 'activity',
        label: 'Activity',
        type: 'string',
        required: false,
        helpText: 'The Activity of the Things',
      },
      {
        key: 'event',
        label: 'Event',
        type: 'string',
        required: false,
        helpText: 'The Event of the Things',
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
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
