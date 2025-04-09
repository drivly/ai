import { Providers } from '@/app/providers'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './code-hike.css'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import Script from 'next/script'

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

const banner = <Banner storageKey='some-key'>Functions.do is released 🎉</Banner>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/docs')

  const navbar = <Navbar logo={<b>.do</b>} logoLink='https://dotdo.ai' chatLink='https://discord.gg/tafnNeUQdm' projectLink='https://github.com/drivly/ai' />
  const footer = (
    <Footer>
      MIT {new Date().getFullYear()} ©{' '}
      <a href='https://dotdo.ai' style={{ textDecoration: 'none', color: 'inherit' }}>
        .do
      </a>
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
            themeSwitch={{ system: 'System', light: 'Light', dark: 'Dark' }}
          >
            {children}
          </Layout>
          <Script src="/json-links.js" strategy="afterInteractive" />
          <Script id="direct-json-links" strategy="afterInteractive">
            {`
              (function() {
                function makeJsonLinksClickable() {
                  const codeBlocks = document.querySelectorAll('pre code.language-json');
                  
                  codeBlocks.forEach((codeBlock) => {
                    const html = codeBlock.innerHTML;
                    
                    const processedHtml = html.replace(
                      /"(https?:\\/\\/[^"]+)"/g, 
                      (match, url) => {
                        return '"<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;cursor:pointer;pointer-events:auto;position:relative;z-index:10;">' + url + '</a>"';
                      }
                    );
                    
                    if (html !== processedHtml) {
                      codeBlock.innerHTML = processedHtml;
                    }
                  });
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', makeJsonLinksClickable);
                } else {
                  makeJsonLinksClickable();
                  setTimeout(makeJsonLinksClickable, 1000);
                  setTimeout(makeJsonLinksClickable, 2000);
                }
                
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                      makeJsonLinksClickable();
                      setTimeout(makeJsonLinksClickable, 1000);
                    }
                  });
                });
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.body, { childList: true, subtree: true });
                  });
                } else {
                  observer.observe(document.body, { childList: true, subtree: true });
                }
              })();
            `}
          </Script>
        </Providers>
      </body>
    </html>
  )
}
