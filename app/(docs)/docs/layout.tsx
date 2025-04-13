import { Layout } from 'nextra-theme-docs'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { Footer } from '@/components/sites/footer'
import { BetterAuthProvider } from '@/lib/auth/context'
import { getContextProps } from '@/lib/auth/context/get-context-props'
import 'nextra-theme-docs/style.css'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './code-hike.css'
import '@/app/(sites)/styles.css'
import { headers } from 'next/headers'

import type { Metadata } from 'next'

/*
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  const pathname = headersList.get('x-pathname') || '/docs'
  
  const canonicalPath = pathname.startsWith('/docs/') ? pathname : '/docs'
  const canonicalUrl = `https://workflows.do${canonicalPath}`
  
  return {
    // Define your metadata here
    // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
    alternates: {
      canonical: canonicalUrl,
    }
  }
}
*/

const banner = <Banner storageKey='some-key'>Functions.do is released 🎉</Banner>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/docs')

  const navbar = <SitesNavbar params={Promise.resolve({})} minimal={true} /> 
  const footer = (
    <Footer minimal={true} className="z-10 relative" />
  )

  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body className="bg-black">
        <BetterAuthProvider {...getContextProps()}>

        <Layout
          // banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase='https://github.com/drivly/ai/tree/main'
          footer={footer}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          themeSwitch={{ system: 'System', light: 'Light', dark: 'Dark' }}
        >
          {children}
        </Layout>
      </body>
        </BetterAuthProvider>

    </html>
  )
}
