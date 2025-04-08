import { getGlowColor } from '@/domains.config'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const useGlowColor = () => {
  const params = useParams<{ domain?: string }>()
  const domain = params.domain || 'apis.do'

  useEffect(() => {
    const glowColor = getGlowColor(domain)

    document.documentElement.style.setProperty('--glow-color', glowColor)

    return () => {
      document.documentElement.style.setProperty('--glow-color', '#05b2a6')
    }
  }, [domain])
}
