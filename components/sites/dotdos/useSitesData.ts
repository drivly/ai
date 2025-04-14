import { brandDomains } from '@/domains.config'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useSitesData() {
  const searchParams = useSearchParams()
  const [hostname, setHostname] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [regionalTld, setRegionalTld] = useState<string>('')

  const absoluteURL = searchParams?.get('absolute') || 'false'
  const showAbsolute = absoluteURL === 'true'

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname
      setHostname(currentHostname)
      
      const match = currentHostname.match(/\.do\.(gt|mw)$/)
      if (match) {
        setRegionalTld(`.${match[1]}`)
      } else {
        setRegionalTld('')
      }
    }
  }, [])

  const isBrandDomain = brandDomains.includes(hostname)

  return {
    mounted,
    isBrandDomain,
    showAbsolute,
    regionalTld,
  }
}
