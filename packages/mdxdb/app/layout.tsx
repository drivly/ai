import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MDXDB',
  description: 'An AI-native database built on MDX',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
