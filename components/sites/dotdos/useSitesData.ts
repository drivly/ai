import { brandDomains } from '@/domains.config'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useSitesData() {
  const searchParams = useSearchParams()
  const [hostname, setHostname] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [currentTld, setCurrentTld] = useState<string>('')

  const absoluteURL = searchParams?.get('absolute') || 'false'
  const showAbsolute = absoluteURL === 'true'

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname
      setHostname(currentHostname)
      
      if (currentHostname.endsWith('.do.gt')) {
        setCurrentTld('.gt')
      } else if (currentHostname.endsWith('.do.mw')) {
        setCurrentTld('.mw')
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
