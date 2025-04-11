'use client'

import { FC } from 'react'

interface SDKReadmeProps {
  name: string
}

/**
 * Simplified component to display SDK README content in Nextra docs
 * This version avoids complex content processing that might cause stack overflow
 */
export const SDKReadme: FC<SDKReadmeProps> = ({ name }) => {
  const sdkName = name.toLowerCase().endsWith('.do') ? name.toLowerCase() : `${name.toLowerCase()}.do`
  
  return (
    <div className="sdk-readme prose prose-invert max-w-none">
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
        .sdk-readme img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        .sdk-readme blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: #94a3b8;
        }
      `}</style>
      <h1>{sdkName} SDK</h1>
      <p>Documentation for the {sdkName} SDK.</p>
      <h2>Installation</h2>
      <pre><code>npm install {sdkName}</code></pre>
      <h2>Usage</h2>
      <pre><code>import {'{'}  {sdkName.replace('.do', '')} {'}'} from '{sdkName}'</code></pre>
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
      <p>For more detailed documentation, please refer to the official documentation.</p>
    </div>
  );
}

export default SDKReadme
