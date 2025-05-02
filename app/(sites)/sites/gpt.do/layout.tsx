import { auth } from '@/auth'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { cookies } from 'next/headers'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()])
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true'

  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
      <div className='flex-1'>{children}</div>
      <Toaster />
    </ThemeProvider>
  )
}
