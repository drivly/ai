'use client'

import { sdks as sdksCollection } from '@/app/_utils/content'
import { FC } from 'react'

interface SDKReadmeSectionProps {
  domain: string
}

/**
 * Component to display SDK README content
 * Shows the README content from the Velite sdks collection for the given domain
 */
export const SDKReadmeSection: FC<SDKReadmeSectionProps> = ({ domain }) => {
  const sdkName = domain.toLowerCase().endsWith('.do') ? domain.toLowerCase() : `${domain.toLowerCase()}.do`
  
  const sdkContent = sdksCollection.find(sdk => {
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
      importPatterns.some(pattern => content.includes(pattern)) ||
      (sdk.title && (
        sdk.title.toLowerCase() === sdkName.toLowerCase() ||
        sdk.title.toLowerCase() === nameWithoutDo.toLowerCase()
      ))
    );
  });

  if (!sdkContent) {
    return null
  }

  return (
    <div className="container mx-auto py-12" id="sdk-documentation">
      <div className="prose prose-invert mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold">SDK Documentation</h2>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: sdkContent.content }} />
      </div>
    </div>
  )
}
