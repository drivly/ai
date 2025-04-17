import { useCallback, useEffect, useRef } from 'react'

export interface UseOutsideClickProps {
  open: (value: boolean) => void
  isOpen: boolean
  withOutsideClick?: boolean
  ignoredSelectors?: readonly string[]
}

export const useOutsideClick = ({ isOpen, open, withOutsideClick, ignoredSelectors }: UseOutsideClickProps) => {
  const elementRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const shouldIgnoreClick = ignoredSelectors?.some((selector) => target.closest(selector))

      if (shouldIgnoreClick) {
        return
      }

      if (elementRef.current && !elementRef.current.contains(target)) {
        open(false)
      }
    },
    [open, ignoredSelectors],
  )

  useEffect(() => {
    if (isOpen && withOutsideClick) {
      document.addEventListener('mousedown', handleClick)
    }

    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, handleClick, withOutsideClick])

  return elementRef
}
