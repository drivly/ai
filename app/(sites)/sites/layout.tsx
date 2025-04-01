import React from 'react'
import './styles.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PostHogProvider } from '@/app/providers'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang='en'>
      <body>
        <PostHogProvider>
          <main>{children}</main>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
