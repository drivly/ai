import React from 'react'

interface HeroProps {
  children: React.ReactNode
}

export function Hero({ children }: HeroProps) {
  return <div className='flex flex-col items-center justify-center py-12 text-center'>{children}</div>
}

export default Hero
