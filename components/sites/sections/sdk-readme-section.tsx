'use client'

import { FC } from 'react'

interface SDKReadmeSectionProps {
  domain: string
}

/**
 * Simplified component to display SDK README content
 * This version avoids complex content processing that might cause stack overflow
 */
export const SDKReadmeSection: FC<SDKReadmeSectionProps> = ({ domain }) => {
  const sdkName = domain.toLowerCase().endsWith('.do') ? domain.toLowerCase() : `${domain.toLowerCase()}.do`
  const nameWithoutDo = sdkName.replace('.do', '');

  return (
    <div className="container mx-auto py-12" id="sdk-documentation">
      <div className="prose prose-invert mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold">SDK Documentation</h2>
        <div className="markdown-content">
          <h1>{sdkName}</h1>
          <p>Documentation for the {sdkName} SDK.</p>
          
          <h2>Installation</h2>
          <pre><code>npm install {sdkName}</code></pre>
          
          <h2>Usage</h2>
          <pre><code>import {'{'}  {nameWithoutDo} {'}'} from '{sdkName}'</code></pre>
          
          <p>For more detailed documentation, please refer to the official documentation.</p>
        </div>
      </div>
    </div>
  )
}
