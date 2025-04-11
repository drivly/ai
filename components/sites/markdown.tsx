'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { CodeBlock } from '@/components/sites/blog-ui/code-block'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <div className='prose prose-lg dark:prose-invert max-w-none'>
      <ReactMarkdown
        components={{
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            return <CodeBlock code={String(children)} language={language} />
          }
        }}>{content}</ReactMarkdown>
    </div>
  )
}
