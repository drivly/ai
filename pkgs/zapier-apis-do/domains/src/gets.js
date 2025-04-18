// Get Domains for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/domains/${bundle.inputData.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return response.data
}

module.exports = {
  key: 'getDomains',
  noun: 'Domains',

  display: {
    label: 'Get Domains',
    description: 'Gets a Domains by ID.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Domains to retrieve',
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
        key: 'project',
        label: 'Project',
      },
      {
        key: 'hostnames',
        label: 'Hostnames',
      },
      {
        key: 'vercelId',
        label: 'VercelId',
      },
      {
        key: 'cloudflareId',
        label: 'CloudflareId',
      },
      {
        key: 'errorMessage',
        label: 'ErrorMessage',
      },
    ],

    sample: {
      id: 'sample-id-1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}
