import { getGlowColor } from '@/domains.config'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const useGlowColor = () => {
  const params = useParams<{ domain?: string }>()
  const domain = params.domain || 'apis.do'

  useEffect(() => {
    const { findSiteContent } = require('@/lib/sites')
    findSiteContent(domain, false).then((content: any) => {
      const glowColor = content.brandColor || getGlowColor(domain)
      
      document.documentElement.style.setProperty('--glow-color', glowColor)
    }).catch((error: Error) => {
      console.error('Error fetching site content:', error)
      document.documentElement.style.setProperty('--glow-color', getGlowColor(domain))
    })
    
    return () => {
      document.documentElement.style.setProperty('--glow-color', '#05b2a6')
    }
  }, [domain])
}
