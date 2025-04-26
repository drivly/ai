import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { secureEvaluateMDX } from '@/lib/mdx/secureEvaluate'
import MDXContent from './mdx-content'

type Params = {
  domain: string
  path: string[]
}

type Props = {
  params: Promise<Params>
  searchParams: Promise<Record<string, string | string[]>>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { domain, path } = params
  const resource = await fetchResource(domain, path)

  if (!resource) return {}

  return {
    title: resource.name || '',
    description: typeof resource.data === 'object' && resource.data !== null && !Array.isArray(resource.data) ? (resource.data.description as string) || '' : '',
  }
}

async function fetchResource(domain: string, path: string[]) {
  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@/payload.config')
    const payload = await getPayload({ config })

    const project = await payload
      .find({
        collection: 'projects',
        where: {
          domain: {
            equals: domain,
          },
        },
        limit: 1,
      })
      .then((result) => result.docs?.[0] || null)

    if (!project) return null

    const resourcePath = path.join('/')
    const resources = await payload.find({
      collection: 'resources',
      where: {
        tenant: {
          equals: project.id,
        },
        'data.path': {
          equals: resourcePath,
        },
      },
      depth: 0,
    })

    return resources.docs[0] || null
  } catch (error) {
    console.error('Error fetching resource:', error)
    return null
  }
}

export default async function ProjectDynamicPage(props: Props) {
  const params = await props.params
  const { domain, path } = params
  const resource = await fetchResource(domain, path)

  if (!resource || !resource.content) {
    notFound()
  }

  const mdxResult = await secureEvaluateMDX(resource.content)

  return <MDXContent source={mdxResult} />
}
