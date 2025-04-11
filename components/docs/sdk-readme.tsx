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
        sdk.content.toLowerCase().includes(`<h1><a href="https://${sdkName}">`) || 
        sdk.content.toLowerCase().includes(`<h1><a href="https://${sdkName.replace('.do', '')}.do">`) ||
        sdk.content.toLowerCase().includes(`# [${sdkName}]`) ||
        sdk.content.toLowerCase().includes(`# [${sdkName.replace('.do', '')}]`) ||
        sdk.content.toLowerCase().includes(`<h1>[${sdkName}]`) ||
        sdk.content.toLowerCase().includes(`<h1>[${sdkName.replace('.do', '')}]`) ||
        sdk.content.toLowerCase().includes(`${sdkName.toLowerCase()}`) ||
        sdk.content.toLowerCase().includes(`${sdkName.replace('.do', '').toLowerCase()}.do`)
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
        {sdkContent.content
          .replace(/<h1.*?>(.*?)<\/h1>/g, '# $1')
          .replace(/<h2.*?>(.*?)<\/h2>/g, '## $1')
          .replace(/<h3.*?>(.*?)<\/h3>/g, '### $1')
          .replace(/<h4.*?>(.*?)<\/h4>/g, '#### $1')
          .replace(/<h5.*?>(.*?)<\/h5>/g, '##### $1')
          .replace(/<h6.*?>(.*?)<\/h6>/g, '###### $1')
          .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
          .replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)')
          .replace(/<code.*?>(.*?)<\/code>/g, '`$1`')
          .replace(/<pre.*?>(.*?)<\/pre>/g, '```\n$1\n```')
          .replace(/<ul.*?>(.*?)<\/ul>/gs, '$1')
          .replace(/<li.*?>(.*?)<\/li>/g, '- $1\n')
          .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
          .replace(/<em>(.*?)<\/em>/g, '*$1*')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/<[^>]*>/g, '')}
      </ReactMarkdown>
    </div>
  )
}

export default SDKReadme
