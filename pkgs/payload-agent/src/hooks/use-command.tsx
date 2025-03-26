import { useCallback, useEffect } from 'react'
import { useModal } from '../components/store/modal-store'
import React from 'react'

export const useCommand = () => {
  const { isOpen, open } = useModal()

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'l' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        open(!isOpen)
      }
    },
    [isOpen, open],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])
}
