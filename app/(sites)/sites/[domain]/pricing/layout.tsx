import type React from 'react'
import { Footer } from '@/components/sites/footer'

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className='bg-white pt-36 dark:bg-black'>{children}</main>
    </>
  )
}
