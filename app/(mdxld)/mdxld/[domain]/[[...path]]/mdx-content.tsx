'use client'

import { useMDXComponents } from '@/mdx-components'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Heading } from 'nextra'

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

export default function MDXContent({ source }: MDXContentProps) {
  const mdxComponents = useMDXComponents()
  const Wrapper = mdxComponents.wrapper
  
  const toc: Heading[] = []
  const metadata = { 
    title: '', 
    description: '',
    filePath: '/mdxld' // Required property for $NextraMetadata
  }
  
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXRemote {...source} components={mdxComponents} />
    </Wrapper>
  )
}
