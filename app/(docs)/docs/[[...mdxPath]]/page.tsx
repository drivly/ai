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

  const previousOpenGraphImages = (await parent).openGraph?.images || []
  const previousTwitterImages = (await parent).twitter?.images || []

  let openGraphImage
  if (mdxPath && mdxPath.length > 0) {
    openGraphImage = `/docs/og?title=${metadata.title}`
  }

  return {
    ...metadata,
    openGraph: {
      images: [...(openGraphImage ? [openGraphImage] : []), ...previousOpenGraphImages],
      ...metadata.openGraph,
    },
    twitter: {
      images: [...(openGraphImage ? [openGraphImage] : []), ...previousTwitterImages],
      ...metadata.twitter,
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
