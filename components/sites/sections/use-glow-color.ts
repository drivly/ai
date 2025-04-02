import { getGlowColor } from '@/domains.config'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const useGlowColor = () => {
  const params = useParams<{ domains?: string[] }>()
  const domain = params.domains || ['apis.do']

  useEffect(() => {
    const glowColor = getGlowColor(domain[0])

    document.documentElement.style.setProperty('--glow-color', glowColor)

    return () => {
      document.documentElement.style.setProperty('--glow-color', '#05b2a6')
    }
  }, [domain])
}
