import { Site } from '@/.velite/index'

/**
 * Categorize sites by their group property
 * @param sites Array of site objects from Velite content
 * @returns Record of category names to arrays of site objects
 */
export async function getSitesByCategory(sites: Site[]) {
  const sitesByCategory: Record<string, Site[]> = {}

  sites.forEach((site) => {
    const group = site.group || 'Other'
    if (!sitesByCategory[group]) {
      sitesByCategory[group] = []
    }
    sitesByCategory[group].push(site)
  })
  
  return sitesByCategory
}
