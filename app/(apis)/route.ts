import { API, formatUrl } from '@/lib/api'
import { domains, domainsConfig, getDomainDescription } from '@/domains.config'
import { apis, related, parentDomains, childDomains, siteCategories } from '@/api.config'
import { collectionSlugs } from '@/collections'
import { titleCase } from '@/lib/utils'
import fs from 'fs/promises'
import path from 'path'

let staticIntegrations: { apps: any[]; categories: any[]; triggers: any; actions: any[] } = {
  apps: [],
  categories: [],
  triggers: { items: [] },
  actions: [],
}

try {
  staticIntegrations = require('../../public/data/integrations.json')
} catch (error) {
  console.warn('Static integrations data not found, will be empty until seed script is run')
}

export const GET = API(async (request, { db, user, origin, url, domain, payload }) => {
  const showDomains = url.searchParams.has('domains')

  const formatWithOptions = (path: string, defaultDomain?: string) =>
    formatUrl(path, {
      origin,
      domain,
      showDomains,
      defaultDomain,
    })
  const collections = payload.collections || {}

  const domainAliases = Object.keys(domainsConfig.aliases)
  const filteredDomains = domains.filter((d) => !domainAliases.includes(d))

  const collectionsByGroup: Record<string, Record<string, any>> = {}

  for (const slug of collectionSlugs) {
    const collection = collections[slug]
    if (!collection) continue

    const adminGroup = collection.config?.admin?.group || 'Other'
    const title = collection.config?.labels?.plural || titleCase(slug)
    const description = collection.config?.admin?.description || ''

    if (!collectionsByGroup[adminGroup]) {
      collectionsByGroup[adminGroup] = {}
    }

    const collectionTitle = `${title}${description ? ` - ${description}` : ''}`
    collectionsByGroup[adminGroup][collectionTitle] = formatWithOptions(slug, `${slug}.do`)
  }

  const formattedApis: Record<string, string> = {}
  for (const [key, description] of Object.entries(apis)) {
    if (key && apis[key] !== undefined) {
      const apiTitle = `${titleCase(key)}${description ? ` - ${description}` : ''}`
      formattedApis[apiTitle] = formatWithOptions(`v1/${key}`, `${key}.do`)
    }
  }

  const formattedSites: Record<string, Record<string, string>> = {}

  for (const [category, sites] of Object.entries(siteCategories)) {
    if (!formattedSites[category]) {
      formattedSites[category] = {}
    }

    for (const site of sites) {
      if (filteredDomains.includes(site)) {
        const siteName = site.replace('.do', '')
        const description = getDomainDescription(site) || ''
        const siteTitle = `${titleCase(siteName)}${description ? ` - ${description}` : ''}`
        formattedSites[category][siteTitle] = formatWithOptions(`sites/${siteName}`, site)
      }
    }
  }

  for (const d of filteredDomains) {
    if (typeof d !== 'string') {
      console.error(`Invalid domain encountered: ${d}`, typeof d)
      continue
    }

    if (d.endsWith('.do')) {
      try {
        let isInCategory = false
        for (const sites of Object.values(siteCategories)) {
          if (sites.includes(d)) {
            isInCategory = true
            break
          }
        }

        if (!isInCategory) {
          const siteName = d.replace('.do', '')
          const description = getDomainDescription(d) || ''
          const siteTitle = `${titleCase(siteName)}${description ? ` - ${description}` : ''}`
          
          let category = 'Other'
          
          if (collectionSlugs.includes(siteName)) {
            category = 'Collections'
            if (!formattedSites['Collections']) {
              formattedSites['Collections'] = {}
            }
          }
          
          if (!formattedSites[category]) {
            formattedSites[category] = {}
          }
          formattedSites[category][siteTitle] = formatWithOptions(`sites/${siteName}`, d)
        }
      } catch (error) {
        console.error(`Error processing domain ${d}:`, error)
      }
    }
  }

  const formattedIntegrations: Record<string, string> = {}
  staticIntegrations.apps?.forEach((app) => {
    const description = app.description || ''
    const appTitle = `${app.name}${description ? ` - ${description}` : ''}`
    formattedIntegrations[appTitle] = formatWithOptions(`integrations/${app.key}`, 'integrations.do')
  })

  const integrations: Record<string, string> = {}
  staticIntegrations.apps?.forEach((app) => {
    integrations[app.key] = `${origin}/${app.key}`
  })

  return {
    collections: collectionsByGroup,
    apis: formattedApis,
    sites: formattedSites,
    integrations, // Use the new integrations object with slug as key
    formattedIntegrations, // Keep the old format for backward compatibility
    actions: {
      toggleDomains: url.searchParams.has('domains') ? url.toString().replace(/[?&]domains/, '') : url.toString() + (url.toString().includes('?') ? '&domains' : '?domains'),
    },
  }
})
