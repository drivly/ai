import { API } from '@/lib/api'
import { domains, domainsConfig } from '@/domains.config'
import { domainDescriptions, apis } from '@/api.config'
import { collectionSlugs } from '@/collections'
import { titleCase } from '@/lib/utils'

export const GET = API(async (request, { db, user, origin, url, domain, payload }) => {
  const collections = payload.collections || {}
  
  const domainAliases = Object.keys(domainsConfig.aliases)
  const filteredDomains = domains.filter(d => !domainAliases.includes(d))
  
  const formattedCollections: Record<string, string> = {}
  for (const slug of collectionSlugs) {
    const title = collections[slug]?.config?.labels?.singular || titleCase(slug)
    formattedCollections[title] = domain !== 'localhost' 
      ? `https://${slug}.do` 
      : `${origin}/${slug}`
  }
  
  const formattedApis: Record<string, string> = {}
  for (const [key, description] of Object.entries(apis)) {
    if (key && apis[key] !== undefined) {
      const apiTitle = `${titleCase(key)}${description ? ` - ${description}` : ''}`
      formattedApis[apiTitle] = domain !== 'localhost' 
        ? `https://${key}.do/api` 
        : `${origin}/api/${key}`
    }
  }
  
  const formattedSites: Record<string, string> = {}
  for (const d of filteredDomains) {
    if (d.endsWith('.do')) {
      const siteName = d.replace('.do', '')
      const description = domainDescriptions[d] || ''
      const siteTitle = `${titleCase(siteName)}${description ? ` - ${description}` : ''}`
      formattedSites[siteTitle] = domain !== 'localhost' 
        ? `https://${d}` 
        : `${origin}/sites/${siteName}`
    }
  }
  
  return {
    collections: formattedCollections,
    apis: formattedApis,
    sites: formattedSites
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
