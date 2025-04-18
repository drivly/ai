import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { createDynamicPayloadConfig } from '@/lib/createDynamicPayloadConfig'
import { importMap } from './importMap'

type Params = {
  domain: string
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  try {
    // Check if params exists before awaiting
    if (!params) {
      return {
        title: 'Documentation',
      }
    }

    const { domain } = await params

    if (!domain) {
      return {
        title: 'Documentation',
      }
    }

    const project = await fetchProjectByDomain(domain)

    if (!project) {
      return {
        title: 'Project Not Found',
      }
    }

    const config = await createDynamicPayloadConfig(project)
    return generatePageMetadata({
      config: Promise.resolve(config),
      params: Promise.resolve({ segments: [] }),
      searchParams: Promise.resolve({}),
    })
  } catch (error) {
    console.error('Error in generateMetadata:', error)
    return {
      title: 'Error',
    }
  }
}

export default async function ProjectAdminPage({ params }: { params: Promise<Params> }) {
  try {
    // Check if params exists before awaiting
    if (!params) {
      notFound()
      return null
    }

    const { domain } = await params

    const project = await fetchProjectByDomain(domain)

    if (!project) {
      notFound()
      return null
    }

    const config = await createDynamicPayloadConfig(project)

    const payload = await getPayload({ config })

    return (
      <div>
        <RootPage config={Promise.resolve(config)} importMap={importMap} params={Promise.resolve({ segments: [] })} searchParams={Promise.resolve({})} />
      </div>
    )
  } catch (error) {
    console.error('Error in ProjectAdminPage:', error)
    notFound()
    return null
  }
}
