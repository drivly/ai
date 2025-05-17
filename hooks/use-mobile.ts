import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile({ width = MOBILE_BREAKPOINT }: { width?: number } = {}) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${width - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < width)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < width)
    return () => mql.removeEventListener('change', onChange)
  }, [width])

  return !!isMobile
}
