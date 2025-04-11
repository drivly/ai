'use client'

import { sdks as sdksCollection } from '@/app/_utils/content'
import { Markdown } from '@/pkgs/ui/src/server/components/markdown'
import { FC } from 'react'

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
        <Markdown className="markdown-content">
          {markdownContent}
        </Markdown>
      </div>
    </div>
  )
}
