'use client'

import { useEffect, useState } from 'react'
import { sites } from '@/app/_utils/content'
import { Site } from '@/.velite'

/**
 * Hook to access the content of the current site based on hostname
 * @returns The site content for the current hostname or undefined if not found
 */
export function useSiteContent() {
  const [hostname, setHostname] = useState<string>('')
  const [siteContent, setSiteContent] = useState<Site | undefined>(undefined)
  
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
      
      const matchingSite = sites.find((site) => {
        const siteTitle = site.title.toLowerCase()
        if (siteTitle.includes('.do')) {
          const siteName = siteTitle.split('.')[0]
          return siteName === subdomain
        }
        return false
      })
      
      setSiteContent(matchingSite)
    }
  }, [])
  
  return siteContent
}
