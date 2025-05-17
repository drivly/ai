import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { AppSidebar } from './components/app-sidebar'
import { TanstackProvider } from './tanstack-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const experimental_ppr = true

export const metadata: Metadata = {
  title: 'GPT.do',
  description: 'Your universal gateway to AI—connect with top language models, customize outputs, and integrate powerful tools all in one place.',
  metadataBase: new URL('https://gpt.do'),
  alternates: {
    canonical: 'https://gpt.do',
  },
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [cookieStore] = await Promise.all([cookies()])
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true'

  return (
    <div className='grid font-sans md:grid-cols-[minmax(256px)_1fr]'>
      <NuqsAdapter>
        <TanstackProvider>
          <SidebarProvider defaultOpen={!isCollapsed}>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </TanstackProvider>
      </NuqsAdapter>
    </div>
  )
}
