import type { Metadata } from 'next'
import { Inter as FontSans, IBM_Plex_Sans, Montserrat, Geist as FontGeist } from 'next/font/google'
import { cn } from '@/lib/utils'
import '@drivly/ui/globals.css'
import { ChatBot } from '@drivly/payload-agent/chat-bot'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const IBM = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-IBM_Plex_Sans',
})

const mont = Montserrat({
  subsets: ['latin'],
  variable: '--font-Montserrat',
})

const fontGeist = FontGeist({
  subsets: ['latin'],
  variable: '--font-geist',
})

// export const metadata: Metadata = {
//   title: 'Drivly Demo',
//   description: 'Powered by Drivly',
// }

export default function DemoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={cn('bg-background overscroll-none font-geist antialiased', fontSans.variable, IBM.variable, mont.variable, fontGeist.variable)}>
        <main className='flex justify-center items-center flex-col min-h-screen'>
          <ChatBot
            aiAvatar='/avatars/ai.webp'
            defaultMessage="I'm the AI assistant for Drivly. Ask me anything about the platform."
            direction='horizontal'
            logo='/DrivlyLogo.svg'
            // suggestions={suggestedActions}
            type='resizable'>
            {children}
          </ChatBot>
        </main>
      </body>
    </html>
  )
}
