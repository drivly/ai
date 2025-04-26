'use client'

import { useState, useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'

export interface UIArtifact {
  documentId: string
  content: string
  kind: 'text' | 'code' | 'image' | 'sheet'
  title: string
  status: 'streaming' | 'idle'
  isVisible: boolean
  boundingBox: {
    top: number
    left: number
    width: number
    height: number
  }
}

export const initialArtifactData: UIArtifact = {
  documentId: 'init',
  content: '',
  kind: 'text',
  title: '',
  status: 'idle',
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
}

export function useArtifact() {
  const [artifact, setArtifactState] = useLocalStorage<UIArtifact>('artifact', initialArtifactData)

  const [metadata, setMetadata] = useState<any>(null)

  const setArtifact = useCallback(
    (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => {
      setArtifactState((currentArtifact) => {
        const artifactToUpdate = currentArtifact || initialArtifactData

        if (typeof updaterFn === 'function') {
          return updaterFn(artifactToUpdate)
        }

        return updaterFn
      })
    },
    [setArtifactState],
  )

  return useMemo(
    () => ({
      artifact,
      setArtifact,
      metadata,
      setMetadata,
    }),
    [artifact, setArtifact, metadata],
  )
}
