import { useCallback, useEffect, useState } from 'react'

type CopiedValue = string | null

type CopyFn = (text: string) => Promise<boolean>

export const useCopyToClipboard = (): [CopiedValue, CopyFn] => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported')
      return false
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.error(`Failed to copy value: ${error}`)
      setCopiedText(null)
      return false
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setCopiedText(null), 2000)
    return () => clearTimeout(timeout)
  }, [copiedText])

  return [copiedText, copy]
}
