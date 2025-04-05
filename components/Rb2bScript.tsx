'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Rb2bScript() {
  const [isWorkflowsDomain, setIsWorkflowsDomain] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const hostname = window.location.hostname
    setIsWorkflowsDomain(hostname === 'workflows.do' || hostname.includes('workflows.do'))
  }, [])

  if (!isWorkflowsDomain) {
    return null
  }

  return <iframe src={`/rb2b?path=${encodeURIComponent(pathname)}`} style={{ display: 'none' }} title='rb2b tracking script' aria-hidden='true' />
}
