import { siteCategories } from "@/api.config"

export function getDomainsByCategory(domains: string[]) {
  const domainsByCategory: Record<string, string[]> = {}

  Object.entries(siteCategories).forEach(([category, categoryDomains]) => {
    domainsByCategory[category] = categoryDomains.filter((domain) => domains.includes(domain))
  })

  // Handle uncategorized domains
  const categorizedDomains = Object.values(domainsByCategory).flat()
  const uncategorizedDomains = domains.filter((domain) => !categorizedDomains.includes(domain))
  if (uncategorizedDomains.length > 0) {
    domainsByCategory['Other'] = uncategorizedDomains
  }
  return domainsByCategory
}
