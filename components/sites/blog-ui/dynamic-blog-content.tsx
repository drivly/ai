'use client'

import { CodeBlock } from './code-block'

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  if (!content) {
    return (
      <div className='prose prose-lg dark:prose-invert max-w-none'>
        <p className='text-muted-foreground'>No content available for this post.</p>
      </div>
    )
  }

  return (
    <div className='prose prose-lg dark:prose-invert max-w-none'>
      <p>{content}</p>
    </div>
  )
}
