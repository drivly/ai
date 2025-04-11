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
      <div dangerouslySetInnerHTML={{ __html: sdkContent.content }} />
      {debugInfo && <pre className="text-xs mt-4 p-2 bg-gray-800 rounded">{debugInfo}</pre>}
    </div>
  );
}

export default SDKReadme
