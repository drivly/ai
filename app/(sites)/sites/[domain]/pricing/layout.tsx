import type React from 'react'

export default async function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className='mx-auto mt-36 max-w-6xl bg-white dark:bg-black'>{children}</main>
    </>
  )
}
