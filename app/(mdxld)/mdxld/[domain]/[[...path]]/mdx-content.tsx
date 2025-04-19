'use client'

import { useMDXComponents } from '@/mdx-components'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

export default function MDXContent({ source }: MDXContentProps) {
  const mdxComponents = useMDXComponents()
  const Wrapper = mdxComponents.wrapper
  
  return (
    <Wrapper>
      <MDXRemote {...source} components={mdxComponents} />
    </Wrapper>
  )
}
