import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { cn } from '@/lib/utils'
import { IBM_Plex_Mono as FontIBM, Geist } from 'next/font/google'
import type React from 'react'
import { Providers } from '../providers'
import './styles.css'

const fontIBM = FontIBM({
  subsets: ['latin'],
  variable: '--font-IBM_Plex_Sans',
  weight: ['400', '500', '600', '700'],
})

const fontGeist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='apple-mobile-web-app-title' content='dotdo.ai' />
      </head>
      <body className={cn('bg-background flex min-h-screen flex-col antialiased', fontGeist.variable, fontIBM.variable)}>
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
