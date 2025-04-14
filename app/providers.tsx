import Rb2bScript from '@/components/Rb2bScript'
import { BetterAuthProvider } from '@/lib/auth/context'
import { getContextProps } from '@/lib/auth/context/get-context-props'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BetterAuthProvider {...getContextProps()}>
      <PostHogProvider client={posthog}>
        {children}
        <Analytics />
        <SpeedInsights />
        <Rb2bScript />
      </PostHogProvider>
    </BetterAuthProvider>
  )
}
