import type React from 'react'

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className='pt-36'>{children}</main>
    </>
  )
}
