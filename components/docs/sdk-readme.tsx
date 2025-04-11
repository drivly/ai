'use client'

import { sdks } from '@/.velite'
import { FC, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface SDKReadmeProps {
  name: string
}

/**
 * Component to display SDK README content in Nextra docs
 */
export const SDKReadme: FC<SDKReadmeProps> = ({ name }) => {
  const sdkName = name.toLowerCase().endsWith('.do') ? name.toLowerCase() : `${name.toLowerCase()}.do`
  
  const sdkContent = sdks.find(
    (sdk) => {
      const contentMatch = sdk.content && (
        sdk.content.toLowerCase().includes(`# ${sdkName}`) || 
        sdk.content.toLowerCase().includes(`# ${sdkName.replace('.do', '')}`)
      )
      
      const titleMatch = sdk.title && (
        sdk.title.toLowerCase() === sdkName || 
        sdk.title.toLowerCase() === sdkName.replace('.do', '')
      )
      
      return contentMatch || titleMatch
    }
  )
  
  if (!sdkContent) {
    return <div>No SDK documentation found for {name}</div>
  }
  
  return (
    <div className="sdk-readme">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sdkContent.content}
      </ReactMarkdown>
    </div>
  )
}

export default SDKReadme
