'use client'

import { sdks } from '@/app/_utils/content'
import { FC } from 'react'

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
      const titleMatch = sdk.title && (
        sdk.title.toLowerCase() === sdkName || 
        sdk.title.toLowerCase() === sdkName.replace('.do', '')
      )
      
      return titleMatch
    }
  )
  
  if (!sdkContent) {
    return <div>No SDK documentation found for {name}</div>
  }
  
  return (
    <div className="sdk-readme">
      <div dangerouslySetInnerHTML={{ __html: sdkContent.content }} />
    </div>
  )
}

export default SDKReadme
