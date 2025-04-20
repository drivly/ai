import { domainsConfig } from '@/domains.config'

export const getDomains = () => {
  const domainList = Object.keys(domainsConfig.domains).filter((domain) => domain.endsWith('.do')) // Only include .do domains

  const limitedDomains = domainList.slice(0, 10)

  const additionalDomains = ['aws.amazon.com', 'microsoft.com', 'google.com', 'apple.com', 'netflix.com']

  return [...limitedDomains, ...additionalDomains]
}
