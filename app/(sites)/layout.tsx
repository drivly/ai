import { Toaster } from '@/components/sites/sonner'
import { ThemeProvider } from '@/components/sites/theme-provider'
import { cn } from '@/components/sites/utils'
import type { Metadata } from 'next'
import { Mona_Sans as FontSans, Geist } from 'next/font/google'
import type React from 'react'
import { Providers } from '../providers'
import './styles.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontGeist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'LLM.do',
  description: 'Build, Run, and Evaluate AI-Powered Tools Effortlessly',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('bg-background flex min-h-screen flex-col font-sans antialiased', fontSans.variable, fontGeist.variable)}>
        <Providers>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
