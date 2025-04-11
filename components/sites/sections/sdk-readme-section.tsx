'use client'

import { sdks as sdksCollection } from '@/app/_utils/content'
import { FC } from 'react'

interface SDKReadmeSectionProps {
  domain: string
}

/**
 * Component to display SDK README content
 * Shows the README content from the Velite sdks collection for the given domain
 */
export const SDKReadmeSection: FC<SDKReadmeSectionProps> = ({ domain }) => {
  const sdkName = domain.toLowerCase().endsWith('.do') ? domain.toLowerCase() : `${domain.toLowerCase()}.do`
  
  const sdkContent = sdksCollection.find(
    (sdk) => {
      if (sdk.content) {
        const content = sdk.content.toLowerCase();
        const nameWithoutDo = sdkName.replace('.do', '');
        
        return (
          content.includes(`# ${sdkName}`) || 
          content.includes(`# [${sdkName}]`) ||
          content.includes(`# ${nameWithoutDo}`) ||
          content.includes(`# [${nameWithoutDo}]`) ||
          content.includes(sdkName) // General check for the domain name
        );
      }
      return false;
    }
  )

  if (!sdkContent) {
    return null
  }

  return (
    <div className="container mx-auto py-12" id="sdk-documentation">
      <div className="prose prose-invert mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold">SDK Documentation</h2>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: sdkContent.content }} />
      </div>
    </div>
  )
}
