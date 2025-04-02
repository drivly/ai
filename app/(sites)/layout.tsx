import { cn } from '@drivly/ui/lib'
import type { Metadata } from 'next'
import { Mona_Sans as FontSans } from 'next/font/google'
import type React from 'react'
import { Footer } from '@/components/sites/footer'
import { Navbar } from '@/components/sites/navbar'
import { Toaster } from '@/components/sites/sonner'
import { ThemeProvider } from '@/components/sites/theme-provider'
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
