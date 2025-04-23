import { brandDomains } from '@/domains.config'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const getInitialHostname = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname
  }
  return ''
}

const getInitialTld = (hostname: string) => {
  const match = hostname.match(/\.do\.(gt|mw)$/)
  return match ? `.${match[1]}` : ''
}

export function useSitesData() {
  const searchParams = useSearchParams()
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const initialHostname = getInitialHostname()
  const initialTld = getInitialTld(initialHostname)
  
  const [hostname, setHostname] = useState<string>(initialHostname)
  const [mounted, setMounted] = useState(!isDevelopment) // Start as true in production
  const [currentTld, setCurrentTld] = useState<string>(initialTld)

  const absoluteURL = searchParams?.get('absolute') || 'false'
  const showAbsolute = absoluteURL === 'true'

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname
      setHostname(currentHostname)

      const match = currentHostname.match(/\.do\.(gt|mw)$/)
      if (match) {
        setCurrentTld(`.${match[1]}`)
      } else {
        setCurrentTld('')
      }
    }
  }, [])

  const isBrandDomain = brandDomains.includes(hostname)

  return {
    mounted,
    isBrandDomain,
    showAbsolute,
    currentTld,
  }
}
