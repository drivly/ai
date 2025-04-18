import { notFound } from 'next/navigation'
import { serialize } from 'next-mdx-remote/serialize'
import MDXContent from './mdx-content'

type Params = {
  domain: string
  path?: string[]
}

type Props = {
  params: Promise<Params>
  searchParams: Promise<Record<string, string | string[]>>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const { domain, path = [] } = params
  const resource = await fetchResource(domain, path)

  if (!resource) return {}

  return {
    title: resource.name,
    description: resource.description || '',
  }
}

async function fetchResource(domain: string, path: string[]) {
  try {
    const { payload } = global as any

    const project = await payload.db.projects.findOne({
      where: {
        domain: {
          equals: domain,
        },
      },
    })

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

export default async function MDXLDPage(props: Props) {
  const params = await props.params
  const { domain, path = [] } = params
  const resource = await fetchResource(domain, path)

  if (!resource || !resource.content) {
    notFound()
  }

  const mdxSource = await serialize(resource.content)

  return <MDXContent source={mdxSource} />
}
