import { brandDomains, siteDomains, isAIGateway } from '../domains.config'

/**
 * Check if a domain should be treated as a gateway domain
 * Gateway domains show the API response at the root path and don't get rewritten
 */
export const isGatewayDomain = (hostname: string): boolean => {
  return isAIGateway(hostname) || hostname === 'localhost' || hostname === 'apis.do' || hostname === 'do.gt' || hostname === 'do.mw' || hostname.endsWith('dev.driv.ly')
}

/**
 * Check if a domain is a brand domain that should rewrite to /sites
 */
export const isBrandDomain = (hostname: string): boolean => {
  return brandDomains.includes(hostname)
}

/**
 * Check if a domain is a site domain that should rewrite to /sites/{domain}
 */
export const isSiteDomain = (hostname: string): boolean => {
  return siteDomains.includes(hostname)
}

/**
 * Check if a domain is a .do domain
 */
export const isDoDomain = (hostname: string): boolean => {
  return hostname.endsWith('.do') || hostname.endsWith('.do.gt') || hostname.endsWith('.do.mw')
}

/**
 * Extract API name from a .do, .do.gt, or .do.mw domain
 */
export const extractApiNameFromDomain = (hostname: string): string => {
  return hostname.replace(/\.do(\.mw|\.gt)?$/, '')
}

/**
 * Check if a domain is a .do.management domain
 */
export const isDoManagementDomain = (hostname: string): boolean => {
  return hostname === 'do.management' || hostname.endsWith('.do.management')
}

/**
 * Extract API name from a .do.management domain
 */
export const extractApiNameFromManagementDomain = (hostname: string): string => {
  return hostname === 'do.management' ? '' : hostname.replace('.do.management', '')
}

/**
 * Check if docs exist for a specific API name
 */
export const docsExistForApi = (apiName: string): boolean => {
  const apisWithDocs = ['functions', 'workflows', 'agents', 'llm', 'integrations', 'database', 'evals', 'experiments']
  return apisWithDocs.includes(apiName)
}

/**
 * Get path to correct docs hierarchy for a domain
 */
export const getDocsPath = (hostname: string): string => {
  const apiName = extractApiNameFromDomain(hostname)
  return `/docs/${apiName}`
}
