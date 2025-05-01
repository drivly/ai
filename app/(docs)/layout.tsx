import { Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { RiDiscordFill, RiGithubFill, RiNpmjsFill, RiTwitterXFill } from '@remixicon/react'
import 'nextra-theme-docs/style.css'
import './styles.css'
// import '@code-hike/mdx/dist/index.css'

import type { Metadata } from 'next'
import { Providers } from '../providers'
import { siteConfig } from '@/components/site-config'

export const metadata = {
  title: {
    template: '.do %s',
    default: 'Documentation | Do Platform',
  },
  description: 'Documentation for the Do platform',
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    images: '/OG_Docs.png',
    type: 'website',
  },
  twitter: {
    images: '/OG_Docs.png',
  },
  keywords: ['business-as-code', 'AI workflows', 'functions', 'agents', 'services', 'business automation'],
} satisfies Metadata

const banner = <Banner storageKey='some-key'>Functions.do is released 🎉</Banner>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/docs')

  const navbar = <Navbar logo={<b>{siteConfig.name}</b>} logoLink={siteConfig.url} chatLink={siteConfig.baseLinks.discord_chat_link} projectLink={siteConfig.baseLinks.github} />

  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body>
        <Providers>
          <Layout
            // banner={banner}
            navbar={navbar}
            pageMap={pageMap}
            docsRepositoryBase={siteConfig.baseLinks.docs_repo_base}
            sidebar={{ defaultMenuCollapseLevel: 1 }}
            themeSwitch={{ system: 'System', light: 'Light', dark: 'Dark' }}
          >
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}
