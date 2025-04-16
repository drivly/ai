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

export async function generateMetadata({ params }: { params: Promise<Params> | Params }): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const domain = resolvedParams?.domain
  
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
}

export default async function ProjectAdminPage({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = params instanceof Promise ? await params : params
  const domain = resolvedParams.domain

  const project = await fetchProjectByDomain(domain)

  if (!project) {
    notFound()
  }

  const config = await createDynamicPayloadConfig(project)

  const payload = await getPayload({ config })

  return (
    <div>
      <RootPage config={Promise.resolve(config)} importMap={importMap} params={Promise.resolve({ segments: [] })} searchParams={Promise.resolve({})} />
    </div>
  )
}
