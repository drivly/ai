import { Footer } from '@/components/sites/footer'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { Fragment } from 'react'
import CallToAction from './sections/call-to-action'
import Pricing from './sections/pricing-section'

type PagePromiseParams<T extends object> = {
  params: Promise<T>
}

type DomainPageProps = PagePromiseParams<{ domain?: string; slug?: string }>

export const withSitesWrapper = <TPage extends DomainPageProps>(WrappedPage: React.ComponentType<TPage>) => {
  return async (props: TPage) => (
    <Fragment>
      <SitesNavbar {...props} />
      <main className='flex-1 overflow-x-hidden'>
        <WrappedPage {...props} />
      </main>
      <Pricing />
      <CallToAction />
      <Footer />
    </Fragment>
  )
}
