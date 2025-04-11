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
      if (sdk.title) {
        const sdkTitle = sdk.title.toLowerCase();
        if (sdkTitle === sdkName || sdkTitle === sdkName.replace('.do', '') || 
            sdkTitle + '.do' === sdkName) {
          return true;
        }
      }
      
      if (sdk.content) {
        const content = sdk.content.toLowerCase();
        return content.includes(sdkName) || content.includes(sdkName.replace('.do', ''));
      }
      
      return false;
    }
  )
  
  if (!sdkContent) {
    return <div>No SDK documentation found for {name}</div>
  }
  
  return (
    <div className="sdk-readme prose prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: sdkContent.content }} />
    </div>
  )
}

export default SDKReadme
