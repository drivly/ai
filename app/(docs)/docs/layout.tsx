import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

const banner = <Banner storageKey='some-key'>Functions.do is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<b>Workflows.do</b>}
    chatLink='https://discord.gg/a87bSRvJkx'
    projectLink='https://github.com/drivly/ai'
    // ... Your additional navbar options
  />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Workflows.do</Footer>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap()
  const docsPageMap = pageMap.filter((page) => 'name' in page && page.name === 'docs')[0]

  if (!docsPageMap || !('children' in docsPageMap)) {
    throw new Error('Setup your docs in the content directory')
  }

  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={docsPageMap.children}
          docsRepositoryBase='https://github.com/drivly/ai/tree/main'
          footer={footer}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          themeSwitch={{ system: 'System', light: 'Light', dark: 'Dark' }}>
          {children}
        </Layout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
