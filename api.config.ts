import { 
  getDomain, 
  getDomainDescription, 
  domainCategories, 
  parentDomains, 
  childDomains, 
  relatedDomains, 
  domainSymbols, 
  domainDescriptions 
} from './domains.config'

export const siteCategories = Object.fromEntries(
  Object.entries(domainCategories).map(([category, domains]) => [
    category,
    domains.map(domain => `${domain}.do`)
  ])
)

export const parentDomainsWithDo: Record<string, string> = Object.fromEntries(
  Object.entries(parentDomains).map(([child, parent]) => [
    `${child}.do`,
    `${parent}.do`
  ])
)

export const childDomainsWithDo: Record<string, string[]> = Object.fromEntries(
  Object.entries(childDomains).map(([parent, children]) => [
    `${parent}.do`,
    children.map(child => `${child}.do`)
  ])
)

export { parentDomainsWithDo as parentDomains }
export { childDomainsWithDo as childDomains }
export { relatedDomains as related }
export { domainSymbols as symbols }

export const apis: Record<string, string> = Object.fromEntries(
  Object.entries(domainDescriptions)
    .map(([key, value]) => [key.toLowerCase(), value])
    .filter(([key]) => !key.includes('.'))
)
