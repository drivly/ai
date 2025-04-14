import { Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './code-hike.css'
import { headers } from 'next/headers'
import { RiDiscordFill, RiGithubFill, RiNpmjsFill, RiTwitterXFill } from '@remixicon/react'
import 'nextra-theme-docs/style.css'

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

  const navbar = <Navbar logo={<b>.do</b>} logoLink='https://dotdo.ai' chatLink='https://discord.gg/tafnNeUQdm' projectLink='https://github.com/drivly/ai' />

  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body>
        <Layout
          // banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase='https://github.com/drivly/ai/tree/main'
          footer={{
            text: (
              <span>
                &copy; {new Date().getFullYear()} <a href="https://dotdo.ai" target="_blank" rel="noopener noreferrer">.do</a>, Inc. All rights reserved.
              </span>
            ),
            links: [
              { href: 'https://github.com/drivly/ai', text: <RiGithubFill className="size-6" /> },
              { href: 'https://discord.gg/26nNxZTz9X', text: <RiDiscordFill className="size-6" /> },
              { href: 'https://x.com/dotdo_ai', text: <RiTwitterXFill className="size-6" /> },
              { href: 'https://www.npmjs.com/package/workflows.do', text: <RiNpmjsFill className="size-6" /> }
            ]
          }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          themeSwitch={{ system: 'System', light: 'Light', dark: 'Dark' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
