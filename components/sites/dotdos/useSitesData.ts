import { brandDomains } from '@/domains.config'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useSitesData() {
  const searchParams = useSearchParams()
  const [hostname, setHostname] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const absoluteURL = searchParams?.get('absolute') || 'false'
  const showAbsolute = absoluteURL === 'true'

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname)
    }
  }, [])

  const isBrandDomain = brandDomains.includes(hostname)

  return {
    mounted,
    isBrandDomain,
    showAbsolute,
  }
}
