import { useMDXComponents } from '@/mdx-components'
import { notFound } from 'next/navigation'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

type Params = {
  domain: string
  path?: string[]
}

export async function generateMetadata({ params }: { params: Params }) {
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

export default async function MDXLDPage({ params }: { params: Params; searchParams: Record<string, string | string[]> }) {
  const { domain, path = [] } = params
  const resource = await fetchResource(domain, path)
  
  if (!resource || !resource.content) {
    notFound()
  }
  
  const mdxSource = await serialize(resource.content)
  const mdxComponents = useMDXComponents()
  const Wrapper = mdxComponents.wrapper
  
  return (
    <Wrapper>
      <MDXRemote {...mdxSource} components={mdxComponents} />
    </Wrapper>
  )
}
