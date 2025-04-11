'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { sites } from '@/.velite'

/**
 * Hook to access site content for the current domain
 * @returns Site content for the current domain
 */
export function useSiteContent() {
  const params = useParams()
  const [content, setContent] = useState<any>(null)
  const domain = params?.domain as string || 'apis.do'

  useEffect(() => {
    const site = domain === '%5Bdomain%5D' ? 'workflows.do' : (domain ?? 'llm.do')
    
    const siteContent = sites.find((s: any) => {
      const titleDomain = s.title.split(' - ')[0].toLowerCase()
      return site === titleDomain.toLowerCase() || 
             site === titleDomain.toLowerCase().replace('.do', '') ||
             s.title.toLowerCase().includes(site.toLowerCase())
    })
    
    if (siteContent) {
      setContent(siteContent)
    } else {
      console.error(`Site content not found for domain: ${domain}`)
      setContent(null)
    }
  }, [domain])

  return content
}
