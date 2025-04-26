import { Octokit } from '@octokit/rest'
import { API } from '@/lib/api'
import { headers } from 'next/headers'

const OWNER = 'drivly'
const REPO = 'ai'
const CACHE_DURATION = 3600 * 1000 // 1 hour in milliseconds

let cachedReleases: Release[] | null = null
let cacheTimestamp = 0

interface Release {
  id: string
  name: string
  tagName: string
  url: string
  publishedAt: string
  body: string
  version: string
  packageName?: string
  prerelease: boolean
}

function parseReleases(releases: any[]): Release[] {
  return releases.map((release) => {
    let packageName: string | undefined
    let version = release.tag_name

    if (release.tag_name.includes('@')) {
      const parts = release.tag_name.split('@')
      packageName = parts[0]
      version = parts[1]
    }

    return {
      id: release.id,
      name: release.name || release.tag_name,
      tagName: release.tag_name,
      url: release.html_url,
      publishedAt: release.published_at,
      body: release.body || '',
      version,
      packageName,
      prerelease: release.prerelease,
    }
  })
}

export const GET = API(async (request, { url, origin }) => {
  const searchParams = request.nextUrl.searchParams
  const packageName = searchParams.get('package')
  const version = searchParams.get('version')
  const branch = searchParams.get('branch')

  try {
    const now = Date.now()
    if (!cachedReleases || now - cacheTimestamp > CACHE_DURATION) {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      })

      const response = await octokit.repos.listReleases({
        owner: OWNER,
        repo: REPO,
        per_page: 100,
      })

      cachedReleases = parseReleases(response.data)
      cacheTimestamp = now
    }

    let filteredReleases = [...cachedReleases]

    if (packageName) {
      filteredReleases = filteredReleases.filter((release) => release.packageName === packageName || release.tagName.includes(packageName))
    }

    if (version) {
      filteredReleases = filteredReleases.filter((release) => release.version === version || release.version.startsWith(version))
    }

    if (branch) {
      if (branch === 'next') {
        filteredReleases = filteredReleases.filter((release) => release.prerelease)
      } else if (branch === 'main') {
        filteredReleases = filteredReleases.filter((release) => !release.prerelease)
      }
    }

    filteredReleases.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return {
      releases: filteredReleases,
      total: filteredReleases.length,
      filters: {
        package: packageName || undefined,
        version: version || undefined,
        branch: branch || undefined,
      },
      links: {
        html: `${origin}/changelog${
          new URLSearchParams({
            ...(packageName ? { package: packageName } : {}),
            ...(version ? { version } : {}),
            ...(branch ? { branch } : {}),
          }).toString()
            ? `?${new URLSearchParams({
                ...(packageName ? { package: packageName } : {}),
                ...(version ? { version } : {}),
                ...(branch ? { branch } : {}),
              }).toString()}`
            : ''
        }`,
      },
    }
  } catch (error) {
    console.error('Error fetching releases:', error)
    return {
      error: 'Failed to fetch release information',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
