import { API } from '@/lib/api'
import { domains, domainsConfig } from '@/domains.config'
import { domainDescriptions, apis, related, parentDomains, childDomains } from '@/api.config'
import { collectionSlugs } from '@/collections'
import { titleCase } from '@/lib/utils'

export const GET = API(async (request, { db, user, origin, url, domain, payload }) => {
  const collections = payload.collections || {}
  
  const domainAliases = Object.keys(domainsConfig.aliases)
  const filteredDomains = domains.filter(d => !domainAliases.includes(d))
  
  const collectionsByGroup: Record<string, Record<string, string>> = {}
  
  for (const slug of collectionSlugs) {
    const collection = collections[slug]
    if (!collection) continue
    
    const adminGroup = collection.config?.admin?.group || 'Other'
    const title = collection.config?.labels?.plural || titleCase(slug)
    
    if (!collectionsByGroup[adminGroup]) {
      collectionsByGroup[adminGroup] = {}
    }
    
    collectionsByGroup[adminGroup][title] = `${origin}/${slug}`
  }
  
  const formattedApis: Record<string, string> = {}
  for (const [key, description] of Object.entries(apis)) {
    if (key && apis[key] !== undefined) {
      const apiTitle = `${titleCase(key)}${description ? ` - ${description}` : ''}`
      formattedApis[apiTitle] = `${origin}/api/${key}`
    }
  }
  
  const formattedSites: Record<string, string> = {}
  for (const d of filteredDomains) {
    if (d.endsWith('.do')) {
      const siteName = d.replace('.do', '')
      const description = domainDescriptions[d] || ''
      const siteTitle = `${titleCase(siteName)}${description ? ` - ${description}` : ''}`
      formattedSites[siteTitle] = `${origin}/sites/${siteName}`
    }
  }
  
  const relatedDomains: Record<string, Record<string, string[]>> = {}
  for (const [key, relatedKeys] of Object.entries(related)) {
    if (relatedKeys.length > 0) {
      const domainKey = `${key}.do`
      relatedDomains[domainKey] = {
        related: relatedKeys.map(r => `${r}.do`)
      }
    }
  }
  
  const domainRelationships: Record<string, any> = {}
  for (const [child, parent] of Object.entries(parentDomains)) {
    if (!domainRelationships[child]) {
      domainRelationships[child] = {}
    }
    domainRelationships[child].parent = parent
  }
  
  for (const [parent, children] of Object.entries(childDomains)) {
    if (!domainRelationships[parent]) {
      domainRelationships[parent] = {}
    }
    domainRelationships[parent].children = children
  }
  
  return {
    collections: collectionsByGroup,
    apis: formattedApis,
    sites: formattedSites,
    related: relatedDomains,
    domains: domainRelationships
  }
})

// "featured": {
//     "Functions - Typesafe Results without Complexity": "https://functions.do",
//     "Workflows - Reliably Execute Business Processes": "https://workflows.do",
//     "Agents - Deploy & Manage Autonomous Digital Workers": "https://agents.do"
//   },
//   "events": {
//     "Triggers - Initiate workflows based on events": "https://triggers.do",
//     "Searches - Query and retrieve data": "https://searches.do",
//     "Actions - Perform tasks within workflows": "https://actions.do"
//   },
//   "core": {
//     "LLM - Intelligent AI Gateway": "https://llm.do",
//     "Evals - Evaluate Functions, Workflows, and Agents": "https://evals.do",
//     "Analytics - Economically Validate Workflows": "https://analytics.do",
//     "Experiments - Economically Validate Workflows": "https://experiments.do",
//     "Database - AI Native Data Access (Search + CRUD)": "https://database.do",
//     "Integrations - Connect External APIs and Systems": "https://integrations.do"
//   },
