'use client'

import { sdks } from '@/app/_utils/content'
import { FC, useEffect, useState } from 'react'

interface SDKReadmeProps {
  name: string
}

/**
 * Component to display SDK README content in Nextra docs
 */
export const SDKReadme: FC<SDKReadmeProps> = ({ name }) => {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const sdkName = name.toLowerCase().endsWith('.do') ? name.toLowerCase() : `${name.toLowerCase()}.do`
  
  let sdkContent = null;
  
  if (sdkName === 'workflows.do') {
    sdkContent = sdks.find(sdk => {
      if (!sdk.content) return false;
      
      const content = sdk.content.toLowerCase();
      
      return (
        content.includes('workflows.do') && 
        content.includes('business process orchestration') &&
        !content.includes('actions.do - elegant external system operations')
      );
    });
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Special workflows.do search result:', !!sdkContent);
    }
  }
  
  if (!sdkContent) {
    sdkContent = sdks.find(sdk => 
      sdk.title && sdk.title.toLowerCase() === sdkName.toLowerCase()
    );
    
    if (!sdkContent) {
      sdkContent = sdks.find(sdk => {
        if (!sdk.content) return false;
        
        const content = sdk.content.toLowerCase();
        const nameWithoutDo = sdkName.replace('.do', '');
        
        const titlePatterns = [
          `<h1><a href="https://${sdkName}">`,
          `<h1>${sdkName}</h1>`,
          `<h1>[${sdkName}]</h1>`,
          `<h1><a href="https://${sdkName}">${sdkName}</a></h1>`,
          `# ${sdkName}`,
          `# [${sdkName}]`,
          `<h1><a href="https://${sdkName.toLowerCase()}">`,
          `${nameWithoutDo}.do - `,
          `${nameWithoutDo} - `,
        ];
        
        const installPatterns = [
          `npm install ${sdkName}`,
          `yarn add ${sdkName}`,
          `pnpm add ${sdkName}`,
        ];
        
        const importPatterns = [
          `import { ${nameWithoutDo} } from '${sdkName}'`,
          `import ${nameWithoutDo} from '${sdkName}'`,
          `import { ai } from '${sdkName}'`,
        ];
        
        return (
          titlePatterns.some(pattern => content.includes(pattern)) ||
          installPatterns.some(pattern => content.includes(pattern)) ||
          importPatterns.some(pattern => content.includes(pattern))
        );
      });
    }
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const info = `Looking for SDK: ${sdkName}\n` +
        `Available SDKs: ${sdks.map(sdk => sdk.title || 'Untitled').join(', ')}\n` +
        `Found: ${sdkContent ? 'Yes' : 'No'}`;
      setDebugInfo(info);
      
      console.log(`SDK search for ${sdkName}:`, {
        found: !!sdkContent,
        availableTitles: sdks.map(sdk => sdk.title),
        matchedContent: sdkContent ? sdkContent.content.substring(0, 200) : 'None'
      });
    }
  }, [sdkName, sdkContent]);
  
  if (!sdkContent) {
    return (
      <>
        <div>No SDK documentation found for {name}</div>
        {debugInfo && <pre className="text-xs mt-4 p-2 bg-gray-800 rounded">{debugInfo}</pre>}
      </>
    );
  }
  
  return (
    <div className="sdk-readme prose prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: sdkContent.content }} />
      {debugInfo && <pre className="text-xs mt-4 p-2 bg-gray-800 rounded">{debugInfo}</pre>}
    </div>
  );
}

export default SDKReadme
