import { API } from '@/lib/api'
import { domains, domainsConfig, getDomainDescription } from '@/domains.config'
import { apis, related, parentDomains, childDomains, siteCategories } from '@/api.config'
import { collectionSlugs } from '@/collections'
import { titleCase } from '@/lib/utils'

export const GET = API(async (request, { db, user, origin, url, domain, payload }) => {
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
    collectionsByGroup[adminGroup][collectionTitle] = `${origin}/${slug}`
  }

  const formattedApis: Record<string, string> = {}
  for (const [key, description] of Object.entries(apis)) {
    if (key && apis[key] !== undefined) {
      const apiTitle = `${titleCase(key)}${description ? ` - ${description}` : ''}`
      formattedApis[apiTitle] = `${origin}/v1/${key}`
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
        formattedSites[category][siteTitle] = `${origin}/sites/${siteName}`
      }
    }
  }

  for (const d of filteredDomains) {
    if (d.endsWith('.do')) {
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
        formattedSites[category][siteTitle] = `${origin}/sites/${siteName}`
      }
    }
  }

  return {
    collections: collectionsByGroup,
    apis: formattedApis,
    sites: formattedSites,
  }
})
