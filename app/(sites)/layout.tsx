import { Footer } from '@/components/sites/footer'
import CallToAction from '@/components/sites/sections/call-to-action'
import { Toaster } from '@/components/sites/sonner'
import { ThemeProvider } from '@/components/sites/theme-provider'
import { cn } from '@/components/sites/utils'
import type { Metadata } from 'next'
import { Mona_Sans as FontSans } from 'next/font/google'
import type React from 'react'
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
          <CallToAction />
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
