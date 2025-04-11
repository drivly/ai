'use client'

import { sdks as sdksCollection } from '@/app/_utils/content'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface SDKReadmeSectionProps {
  domain: string
}

/**
 * Component to display SDK README content
 * Shows the README content from the Velite sdks collection for the given domain
 */
export const SDKReadmeSection: FC<SDKReadmeSectionProps> = ({ domain }) => {
  const sdkContent = sdksCollection.find(
    (sdk) => sdk.title?.toLowerCase() === domain.toLowerCase() || 
             sdk.title?.toLowerCase() === domain.toLowerCase().replace('.do', '')
  )

  if (!sdkContent) {
    return null
  }

  const markdownContent = sdkContent.content || ''

  return (
    <div className="container mx-auto py-12">
      <div className="prose prose-invert mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold">SDK Documentation</h2>
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
