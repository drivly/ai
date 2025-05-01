import { auth } from '@/auth'
import { AuthSync } from '@/components/auth/auth-sync'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Rb2bScript from '@/components/Rb2bScript'
import { PostHogProvider } from '@/components/shared/post-hog-provider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SessionProvider } from 'next-auth/react'

export async function Providers({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <PostHogProvider>
        {children}
        <AuthSync />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
        <Rb2bScript />
      </PostHogProvider>
    </SessionProvider>
  )
}
