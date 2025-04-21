import { API } from '@/lib/api'
import { Octokit } from '@octokit/rest'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

const CACHE_DURATION = 3600 * 1000 // 1 hour in milliseconds
let cachedReleases: any = null
let cacheTimestamp: number = 0

const OWNER = 'drivly'
const REPO = 'ai'

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
  return releases.map(release => {
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
      prerelease: release.prerelease
    }
  })
}

function generateHtmlChangelog(releases: Release[]): string {
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>Changelog - Drivly AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 10px;
    }
    .release {
      margin-bottom: 30px;
    }
    .release-header {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 10px;
    }
    .release-title {
      font-size: 1.4em;
      margin: 0;
      font-weight: 600;
    }
    .release-date {
      color: #666;
      font-size: 0.9em;
    }
    .release-tag {
      font-size: 0.9em;
      color: #0366d6;
      font-family: monospace;
    }
    .release-body {
      white-space: pre-wrap;
    }
    .package-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: #e1f5fe;
      color: #0277bd;
      font-size: 0.8em;
      margin-right: 8px;
    }
    .pre-release-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: #fff9c4;
      color: #fbc02d;
      font-size: 0.8em;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>Changelog</h1>
`

  for (const release of releases) {
    const date = new Date(release.publishedAt)
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    html += `
    <div class="release">
      <div class="release-header">
        <h2 class="release-title">
          <a href="${release.url}" target="_blank">${release.name}</a>
        </h2>
        <span class="release-date">${formattedDate}</span>
        <span class="release-tag">${release.version}</span>
        ${release.packageName ? `<span class="package-badge">${release.packageName}</span>` : ''}
        ${release.prerelease ? '<span class="pre-release-badge">Pre-release</span>' : ''}
      </div>
      <div class="release-body">${release.body.replace(/\n/g, '<br>')}</div>
    </div>
    `
  }

  html += `
</body>
</html>
  `
  
  return html
}

export const GET = API(async (request, { url, origin }) => {
  const searchParams = request.nextUrl.searchParams
  const packageName = searchParams.get('package')
  const version = searchParams.get('version')
  const format = searchParams.get('format')
  const branch = searchParams.get('branch')
  const headersList = await headers()
  const acceptHeader = headersList.get('accept') || ''
  
  const wantsJson = 
    format === 'json' || 
    acceptHeader.includes('application/json') ||
    !acceptHeader.includes('text/html')
  
  try {
    const now = Date.now()
    if (!cachedReleases || (now - cacheTimestamp) > CACHE_DURATION) {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
      })
      
      const response = await octokit.repos.listReleases({
        owner: OWNER,
        repo: REPO,
        per_page: 100
      })
      
      cachedReleases = parseReleases(response.data)
      cacheTimestamp = now
    }
    
    let filteredReleases = [...cachedReleases]
    
    if (packageName) {
      filteredReleases = filteredReleases.filter(release => 
        release.packageName === packageName || 
        release.tagName.includes(packageName)
      )
    }
    
    if (version) {
      filteredReleases = filteredReleases.filter(release => 
        release.version === version || 
        release.version.startsWith(version)
      )
    }
    
    if (branch) {
      if (branch === 'next') {
        filteredReleases = filteredReleases.filter(release => release.prerelease)
      } else if (branch === 'main') {
        filteredReleases = filteredReleases.filter(release => !release.prerelease)
      }
    }
    
    filteredReleases.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    
    if (wantsJson) {
      return {
        releases: filteredReleases,
        total: filteredReleases.length,
        filters: {
          package: packageName || undefined,
          version: version || undefined,
          branch: branch || undefined
        },
        links: {
          html: `${origin}/changelog?format=html${packageName ? `&package=${packageName}` : ''}${version ? `&version=${version}` : ''}${branch ? `&branch=${branch}` : ''}`,
        },
      }
    } else {
      const htmlContent = generateHtmlChangelog(filteredReleases)
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }
  } catch (error) {
    console.error('Error fetching releases:', error)
    return {
      error: 'Failed to fetch release information',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
