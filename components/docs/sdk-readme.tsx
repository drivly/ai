'use client'

import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useState } from 'react'

interface SDKReadmeProps {
  name: string
}

/**
 * Component to display SDK README content in Nextra docs
 * Fetches the raw README.md content directly from the SDK package
 */
export const SDKReadme: FC<SDKReadmeProps> = ({ name }) => {
  const [readmeContent, setReadmeContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  const sdkName = name.toLowerCase().endsWith('.do') ? name.toLowerCase() : `${name.toLowerCase()}.do`
  
  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const response = await fetch(`/sdks/${sdkName}/README.md`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch README for ${sdkName}`)
        }
        
        const content = await response.text()
        setReadmeContent(content)
        setIsLoading(false)
      } catch (err) {
        console.error(`Error fetching README for ${sdkName}:`, err)
        setError(`Could not load README for ${sdkName}`)
        setIsLoading(false)
      }
    }
    
    fetchReadme()
  }, [sdkName])
  
  if (isLoading) {
    return <div>Loading SDK documentation...</div>
  }
  
  if (error) {
    return <div>{error}</div>
  }
  
  if (!readmeContent) {
    return <div>No SDK documentation found for {name}</div>
  }
  
  return (
    <div className="sdk-readme">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {readmeContent}
      </ReactMarkdown>
    </div>
  )
}

export default SDKReadme
