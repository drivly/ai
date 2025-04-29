import type { CollectionConfig } from 'payload'

export const Domains: CollectionConfig = {
  slug: 'domains',
  admin: {
    group: 'Projects',
    useAsTitle: 'name',
    description: 'Manages domain connections and DNS configuration',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'domain', type: 'text', required: true },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'active', 'error'],
      defaultValue: 'pending',
      admin: { readOnly: true },
    },
    {
      name: 'hostnames',
      type: 'array',
      admin: { readOnly: true },
      fields: [{ name: 'hostname', type: 'text' }],
    },
    { name: 'vercelId', type: 'text', admin: { hidden: true } },
    { name: 'cloudflareId', type: 'text', admin: { hidden: true } },
    { name: 'errorMessage', type: 'text', admin: { condition: (data) => data?.status === 'error' } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          const { payload } = req
          console.log(`Queueing domain ${operation} for ${doc.domain}`)
          try {
            const job = await payload.jobs.queue({
              task: 'executeFunction',
              input: {
                functionName: 'processDomain',
                args: {
                  domainId: doc.id,
                  operation,
                },
              },
            })
            console.log(`Queued domain ${operation}`, job)
            await payload.jobs.runByID({ id: job.id })
          } catch (error) {
            console.error(`Error queueing domain ${operation}:`, error)
          }
        }
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const { payload } = req
        try {
          const domain = (await payload.findByID({
            collection: 'domains' as any,
            id,
          })) as any

          if (domain) {
            console.log(`Queueing domain deletion for ${domain.domain}`)
            const job = await payload.jobs.queue({
              task: 'executeFunction',
              input: {
                functionName: 'processDomain',
                args: {
                  domainId: id,
                  operation: 'delete',
                  domain: domain.domain,
                  vercelId: domain.vercelId,
                  cloudflareId: domain.cloudflareId,
                },
              },
            })
            console.log('Queued domain deletion', job)
            await payload.jobs.runByID({ id: job.id })
          }
        } catch (error) {
          console.error('Error in beforeDelete hook:', error)
        }
      },
    ],
  },
}
