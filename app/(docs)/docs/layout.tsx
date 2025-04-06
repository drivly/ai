import { Providers } from '@/app/providers'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './code-hike.css'

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

const banner = <Banner storageKey='some-key'>Functions.do is released 🎉</Banner>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/docs')

  const navbar = <Navbar logo={<b><a href="https://dotdo.ai" style={{ textDecoration: 'none', color: 'inherit' }}>.do</a></b>} chatLink='https://discord.gg/tafnNeUQdm' projectLink='https://github.com/drivly/ai' />
  const footer = (
    <Footer>
      MIT {new Date().getFullYear()} © <a href="https://dotdo.ai" style={{ textDecoration: 'none', color: 'inherit' }}>.do</a>
    </Footer>
  )

  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body>
        <Providers>
          <Layout
            banner={banner}
            navbar={navbar}
            pageMap={pageMap}
            docsRepositoryBase='https://github.com/drivly/ai/tree/main'
            footer={footer}
            sidebar={{ defaultMenuCollapseLevel: 1 }}
            themeSwitch={{ system: 'System', light: 'Light', dark: 'Dark' }}>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}
