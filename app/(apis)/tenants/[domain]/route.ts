import { API } from '@/lib/api'

/**
 * Placeholder API handler for custom tenant domains
 * This route handles requests for custom domains that are not part of the .do ecosystem
 */
export const GET = API(async (request, { params }) => {
  const { domain } = params as { domain: string }
  
  return {
    tenant: domain,
    message: `This is a placeholder for tenant domain: ${domain}`,
    status: 'Coming soon'
  }
})
