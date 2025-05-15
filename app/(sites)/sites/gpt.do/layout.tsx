import { AppSidebar } from '@/app/(sites)/sites/gpt.do/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'
import { TanstackProvider } from './query-client-provider'

export const experimental_ppr = true

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [cookieStore] = await Promise.all([cookies()])
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true'

  return (
    <div className='grid font-sans md:grid-cols-[minmax(256px)_1fr]'>
      <TanstackProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </TanstackProvider>
    </div>
  )
}
