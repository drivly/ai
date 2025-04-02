import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Mona_Sans as FontSans } from 'next/font/google'
import type React from 'react'
import { Footer } from './_components/footer'
import { Navbar } from './_components/navbar'
import { Toaster } from './_components/sonner'
import { ThemeProvider } from './_components/theme-provider'
import './styles.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'LLM.do',
  description: 'Build, Run, and Evaluate AI-Powered Tools Effortlessly',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('bg-background flex min-h-screen flex-col font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          {children}
          {/* <Navbar />
          <main className='flex-1'>{children}</main> */}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
