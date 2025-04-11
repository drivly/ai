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
  
  console.log('Available SDK titles:', sdks.map(sdk => sdk.title))
  console.log('Looking for SDK:', sdkName)
  
  let sdkContent = sdks.find(sdk => 
    sdk.title && sdk.title.toLowerCase() === sdkName.toLowerCase()
  )
  
  if (!sdkContent) {
    sdkContent = sdks.find(sdk => {
      if (sdk.content) {
        const content = sdk.content.toLowerCase();
        const nameWithoutDo = sdkName.replace('.do', '');
        
        const titleMatch = 
          content.includes(`<h1><a href="https://${sdkName}">`) || 
          content.includes(`<h1>${sdkName}</h1>`) ||
          content.includes(`<h1>[${sdkName}]</h1>`) ||
          content.includes(`<h1><a href="https://${sdkName}">${sdkName}</a></h1>`) ||
          content.includes(`# ${sdkName}`) || 
          content.includes(`# [${sdkName}]`);
          
        if (titleMatch) {
          return true;
        }
        
        const packageMatch = 
          content.includes(`npm install ${sdkName}`) ||
          content.includes(`yarn add ${sdkName}`) ||
          content.includes(`pnpm add ${sdkName}`);
          
        return packageMatch;
      }
      return false;
    });
  }
  
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
