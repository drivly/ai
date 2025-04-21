'use client'

import { useMDXComponents } from '@/mdx-components'

interface MDXContentProps {
  source: any
}

export default function MDXContent({ source }: MDXContentProps) {
  const mdxComponents = useMDXComponents()
  const Wrapper = mdxComponents.wrapper

  const toc: any[] = []
  const metadata = {
    title: '',
    description: '',
    filePath: '/projects', // Required property for $NextraMetadata
  }

  const safeComponents = { ...mdxComponents }
  delete safeComponents.symbol // Remove the problematic symbol component

  return (
    <Wrapper toc={toc} metadata={metadata}>
      {source.default({ components: safeComponents })}
    </Wrapper>
  )
}
