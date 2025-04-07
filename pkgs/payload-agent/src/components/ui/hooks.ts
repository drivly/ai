'use client'

import React, { useEffect, useRef, useState } from 'react'

export function useOutsideClick({ isOpen, open, withOutsideClick = true }: { isOpen: boolean; open: (value: boolean) => void; withOutsideClick?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!withOutsideClick) return

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        open(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, open, withOutsideClick])

  return ref
}

export function useCheckMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}

export function createRequiredContext<T>(displayName: string) {
  const Context = React.createContext<T | undefined>(undefined)
  Context.displayName = displayName

  function useContext(props?: any) {
    const context = React.useContext(Context)
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`)
    }
    return context
  }

  return [Context.Provider, useContext] as const
}
