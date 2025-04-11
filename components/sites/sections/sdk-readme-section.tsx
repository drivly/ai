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
        <div className="sdk-readme markdown-content">
          <style jsx global>{`
            .sdk-readme h1 {
              font-size: 2.5rem;
              margin-bottom: 1rem;
              font-weight: 700;
            }
            .sdk-readme h2 {
              font-size: 1.75rem;
              margin-top: 2rem;
              margin-bottom: 0.75rem;
              font-weight: 600;
            }
            .sdk-readme h3 {
              font-size: 1.5rem;
              margin-top: 1.5rem;
              margin-bottom: 0.5rem;
              font-weight: 600;
            }
            .sdk-readme p {
              margin-bottom: 1rem;
              line-height: 1.7;
            }
            .sdk-readme pre {
              background-color: #1e293b;
              padding: 1rem;
              border-radius: 0.375rem;
              overflow-x: auto;
              margin-bottom: 1rem;
            }
            .sdk-readme code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
              font-size: 0.9em;
              background-color: rgba(30, 41, 59, 0.5);
              padding: 0.2em 0.4em;
              border-radius: 0.25rem;
            }
            .sdk-readme pre code {
              background-color: transparent;
              padding: 0;
            }
            .sdk-readme ul {
              list-style-type: disc;
              margin-left: 1.5rem;
              margin-bottom: 1rem;
            }
            .sdk-readme ol {
              list-style-type: decimal;
              margin-left: 1.5rem;
              margin-bottom: 1rem;
            }
            .sdk-readme li {
              margin-bottom: 0.5rem;
            }
            .sdk-readme a {
              color: #3b82f6;
              text-decoration: none;
            }
            .sdk-readme a:hover {
              text-decoration: underline;
            }
          `}</style>
          <h1>{sdkName}</h1>
          <p>Documentation for the {sdkName} SDK.</p>
          
          <h2>Installation</h2>
          <pre><code>npm install {sdkName}</code></pre>
          
          <h2>Usage</h2>
          <pre><code>import {'{'}  {nameWithoutDo} {'}'} from '{sdkName}'</code></pre>
          
          <h2>Features</h2>
          <ul>
            <li>Lightweight SDK with minimal dependencies</li>
            <li>Built on the unified API gateway (apis.do)</li>
            <li>TypeScript support with full type definitions</li>
            <li>Compatible with both browser and Node.js environments</li>
          </ul>
          
          <p>For more detailed documentation, please refer to the official documentation.</p>
        </div>
      </div>
    </div>
  )
}
