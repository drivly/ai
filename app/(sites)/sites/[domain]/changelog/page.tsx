import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Octokit } from '@octokit/rest'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const revalidate = 3600

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

export async function generateMetadata() {
  return {
    title: 'Changelog - Drivly AI',
    description: 'Latest updates and releases from the Drivly AI platform',
  }
}

async function ChangelogPage({ params, searchParams = {} }: { params: { domain: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const packageName = typeof searchParams.package === 'string' ? searchParams.package : undefined
  const version = typeof searchParams.version === 'string' ? searchParams.version : undefined
  const branch = typeof searchParams.branch === 'string' ? searchParams.branch : undefined
  const format = typeof searchParams.format === 'string' ? searchParams.format : undefined
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  })
  
  const response = await octokit.repos.listReleases({
    owner: OWNER,
    repo: REPO,
    per_page: 100
  })
  
  let releases = parseReleases(response.data)
  
  if (packageName) {
    releases = releases.filter(release => 
      release.packageName === packageName || 
      release.tagName.includes(packageName)
    )
  }
  
  if (version) {
    releases = releases.filter(release => 
      release.version === version || 
      release.version.startsWith(version)
    )
  }
  
  if (branch) {
    if (branch === 'next') {
      releases = releases.filter(release => release.prerelease)
    } else if (branch === 'main') {
      releases = releases.filter(release => !release.prerelease)
    }
  }
  
  releases.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  
  const headersList = headers()
  const acceptHeader = headersList.get('accept') || ''
  const wantsJson = 
    format === 'json' || 
    acceptHeader.includes('application/json') ||
    !acceptHeader.includes('text/html')
  
  if (wantsJson) {
    return NextResponse.json({
      releases,
      total: releases.length,
      filters: {
        package: packageName || undefined,
        version: version || undefined,
        branch: branch || undefined
      }
    })
  }
  
  return (
    <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
      <Link href='/' className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>
      
      <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text text-4xl leading-tight font-medium tracking-tighter text-balance text-transparent dark:from-white dark:to-white/40 mb-8'>
        Changelog
      </h1>
      
      {releases.map(release => {
        const date = new Date(release.publishedAt)
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        
        return (
          <div key={release.id} className='mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0'>
            <div className='flex items-baseline gap-3 flex-wrap mb-2'>
              <h2 className='text-xl font-medium'>
                <a href={release.url} target="_blank" rel="noopener noreferrer" className='hover:text-primary transition-colors'>
                  {release.name}
                </a>
              </h2>
              <span className='text-sm text-gray-500'>{formattedDate}</span>
              <code className='text-sm text-blue-600 font-mono'>{release.version}</code>
              {release.packageName && (
                <span className='inline-block px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
                  {release.packageName}
                </span>
              )}
              {release.prerelease && (
                <span className='inline-block px-2 py-1 text-xs rounded-md bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'>
                  Pre-release
                </span>
              )}
            </div>
            <div className='prose prose-sm dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: release.body.replace(/\n/g, '<br>') }} />
          </div>
        )
      })}
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: ChangelogPage, withFaqs: false })
