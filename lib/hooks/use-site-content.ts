'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { findSiteContent } from '@/lib/sites'

/**
 * Hook to access site content for the current domain
 * @returns Site content for the current domain
 */
export function useSiteContent() {
  const params = useParams()
  const [content, setContent] = useState<any>(null)
  const domain = params?.domain as string || 'apis.do'

  useEffect(() => {
    findSiteContent(domain, false)
      .then((siteContent) => {
        setContent(siteContent)
      })
      .catch((error) => {
        console.error('Error fetching site content:', error)
      })
  }, [domain])

  return content
}
