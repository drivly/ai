import GoogleAnalytics from '@/components/GoogleAnalytics'
import Rb2bScript from '@/components/Rb2bScript'
import { PostHogProvider } from '@/components/shared/post-hog-provider'
import { BetterAuthProvider } from '@/lib/auth/context'
import { getContextProps } from '@/lib/auth/context/get-context-props'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BetterAuthProvider {...getContextProps()}>
      <PostHogProvider>
        {children}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
        <Rb2bScript />
      </PostHogProvider>
    </BetterAuthProvider>
  )
}
