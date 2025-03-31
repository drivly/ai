import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { PayloadAgentAuthResult } from '../types/auth'

export interface UseAuthUserOptions {
  initialAuthResult?: PayloadAgentAuthResult
  getAuthResult?: () => Promise<PayloadAgentAuthResult>
}

export const useAuthResult = ({ initialAuthResult, getAuthResult }: UseAuthUserOptions) => {
  const pathname = usePathname()

  const [authResult, setAuthResult] = useState<PayloadAgentAuthResult | null>(initialAuthResult ?? null)

  useEffect(() => {
    if (initialAuthResult) {
      setAuthResult(initialAuthResult)
    } else if (getAuthResult) {
      getAuthResult().then(setAuthResult)
    } else {
      setAuthResult(null)
    }
  }, [pathname, initialAuthResult, getAuthResult])

  return authResult
}
