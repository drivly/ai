import { Providers } from '@/app/providers'
import { Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'

export default function ReferenceLayout({ children }: { children: React.ReactNode }) {
  const navbar = <Navbar logo={<b>.do</b>} logoLink='https://dotdo.ai' chatLink='https://discord.gg/tafnNeUQdm' projectLink='https://github.com/drivly/ai' />

  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body>
        <Providers>
          <div className="full-width-header">
            {navbar}
          </div>
          <main className="reference-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
