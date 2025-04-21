import { Layout } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export default async function MDXLDLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/mdxld')

  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body>
        <Layout pageMap={pageMap} themeSwitch={{ system: 'System', light: 'Light', dark: 'Dark' }}>
          {children}
        </Layout>
      </body>
    </html>
  )
}
