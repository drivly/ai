/**
 * Edge-compatible version of fetchProjectByDomain
 * Uses fetch API instead of Payload CMS directly
 * @param domain The domain to search for
 * @returns The project data or null if not found
 */
export async function fetchProjectByDomainEdge(domain: string): Promise<{ name: string; domain: string; id: string } | null> {
  if (!domain) {
    throw new Error('Domain is required')
  }

  try {
    const response = await fetch(`/api/projects?domain=${encodeURIComponent(domain)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data && data.docs && data.docs.length > 0) {
      return data.docs[0]
    }

    return null
  } catch (error) {
    console.error(`Error fetching project by domain '${domain}':`, error)

    return {
      name: domain,
      domain: domain,
      id: 'unknown',
    }
  }
}
