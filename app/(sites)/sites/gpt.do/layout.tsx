import { auth } from '@/auth'
import { AppSidebar } from '@/components/chat/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'

export const experimental_ppr = true

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()])
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true'

  return (
    <>
      <SidebarProvider defaultOpen={isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  )
}
