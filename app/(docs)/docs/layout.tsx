import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { headers } from 'next/headers'

function getDomainLogo(hostname: string) {
  if (hostname.endsWith('.do') && !hostname.slice(0, -3).includes('.')) {
    return hostname
  }
  return 'APIs.do'
}

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

const banner = <Banner storageKey='some-key'>Functions.do is released 🎉</Banner>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const host = headersList.get('host') || 'apis.do'
  const logoText = getDomainLogo(host)

  const navbar = <Navbar logo={<b>{logoText}</b>} chatLink='https://discord.gg/a87bSRvJkx' projectLink='https://github.com/drivly/ai' />
  const footer = (
    <Footer>
      MIT {new Date().getFullYear()} © {logoText}
    </Footer>
  )

  return (
    <html
      // Not required, but good for SEO
      lang='en'
      // Required to be set
      dir='ltr'
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase='https://github.com/drivly/ai/tree/main'
          footer={footer}
          defaultMenuCollapsed={true}
          // ... Your additional layout options
        >
          {children}
        </Layout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
