'use client'

import useConfetti from '@/components/shared/use-confetti'
import React, { useEffect } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'

export interface TemplateProps {
  children: React.ReactNode
}

const Template = ({ children }: TemplateProps) => {
  const { canvasStyles, getInstance, fire } = useConfetti()

  useEffect(() => {
    fire()
  }, [fire])

  return (
    <>
      <ReactCanvasConfetti className='z-50' onInit={getInstance} style={canvasStyles} />
      {children}
    </>
  )
}

export default Template
