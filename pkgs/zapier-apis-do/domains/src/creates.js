// Create Domains for Zapier
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.apiUrl}/api/domains`,
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
  key: 'createDomains',
  noun: 'Domains',

  display: {
    label: 'Create Domains',
    description: 'Creates a new Domains.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        helpText: 'The Name of the Domains',
      },
      {
        key: 'domain',
        label: 'Domain',
        type: 'string',
        required: true,
        helpText: 'The Domain of the Domains',
      },
      {
        key: 'project',
        label: 'Project',
        type: 'string',
        required: true,
        helpText: 'The ID of the related projects',
      },
      {
        key: 'hostnames',
        label: 'Hostnames',
        type: 'string',
        required: false,
        helpText: 'JSON array of hostnames items',
      },
      {
        key: 'vercelId',
        label: 'VercelId',
        type: 'string',
        required: false,
        helpText: 'The VercelId of the Domains',
      },
      {
        key: 'cloudflareId',
        label: 'CloudflareId',
        type: 'string',
        required: false,
        helpText: 'The CloudflareId of the Domains',
      },
      {
        key: 'errorMessage',
        label: 'ErrorMessage',
        type: 'string',
        required: false,
        helpText: 'The ErrorMessage of the Domains',
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
