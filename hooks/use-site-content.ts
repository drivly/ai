'use client'

import { useEffect, useState } from 'react'
import { sites } from '@/app/_utils/content'

/**
 * Hook to access the content of the current site based on hostname
 * @returns The site content for the current hostname or undefined if not found
 */
export function useSiteContent() {
  const [hostname, setHostname] = useState<string>('')
  interface SiteContent {
    _path: string
    title: string
    description: string
    headline: string
    subhead?: string
    brandColor?: string
    content: string
    group?: string
    codeExample?: string
    codeLang?: string
    badge?: string
    faqs?: Array<{
      question: string
      answer: string
    }>
    [key: string]: any
  }
  
  const [siteContent, setSiteContent] = useState<SiteContent | undefined>(undefined)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname
      setHostname(currentHostname)
      
      const parts = currentHostname.split('.')
      let subdomain = parts[0]
      
      if (currentHostname === 'localhost') {
        const pathParts = window.location.pathname.split('/')
        if (pathParts.length > 1 && pathParts[1]) {
          subdomain = pathParts[1]
        }
      }
      
      const matchingSite = sites.find((site: SiteContent) => {
        const sitePath = site._path.split('/')
        const siteName = sitePath[sitePath.length - 1].replace('.do.mdx', '')
        return siteName === subdomain
      })
      
      setSiteContent(matchingSite)
    }
  }, [])
  
  return siteContent
}
