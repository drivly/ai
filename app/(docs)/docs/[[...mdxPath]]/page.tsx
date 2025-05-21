import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '@/mdx-components'
import { ResolvingMetadata } from 'next'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type Props = {
  params: Promise<{ mdxPath: string[] }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata) {
  const { mdxPath } = await props.params
  const { metadata } = await importPage(mdxPath)

  let openGraphImage
  if (mdxPath && mdxPath.length > 0) {
    openGraphImage = `/docs/og?title=${metadata.title}`
  }

  const canonicalDomain = metadata.canonicalDomain || 'workflows.do'

  const canonicalPath = mdxPath?.join('/') || ''
  const canonicalUrl = `https://${canonicalDomain}/docs${canonicalPath ? `/${canonicalPath}` : ''}`

  return {
    ...metadata,
    openGraph: {
      images: [...(openGraphImage ? [openGraphImage] : [])],
      ...metadata.openGraph,
    },
    twitter: {
      images: [...(openGraphImage ? [openGraphImage] : [])],
      ...metadata.twitter,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: Props) {
  const params = await props.params
  const result = await importPage(params.mdxPath)
  const { default: MDXContent, toc, metadata } = result
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
