import { Footer } from '@/components/sites/footer'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { Fragment } from 'react'
import CallToAction from './sections/call-to-action'
import { Faqs } from './sections/faqs'

type PagePromiseParams<T extends object> = {
  params: Promise<T>
}

type DomainPageProps = PagePromiseParams<{ domain?: string; slug?: string }>

export const withSitesWrapper = <TPage extends DomainPageProps>({
  WrappedPage,
  minimal = false,
  withFaqs = true,
  withCallToAction = true,
}: {
  WrappedPage: React.ComponentType<TPage>
  minimal?: boolean
  withFaqs?: boolean
  withCallToAction?: boolean
}) => {
  return async (props: TPage) => (
    <Fragment>
      <SitesNavbar {...props} minimal={minimal} />
      <main className='flex-1 overflow-x-hidden border-b border-gray-800/50'>
        <WrappedPage {...props} />
      </main>
      {withFaqs && <Faqs />}
      {withCallToAction && <CallToAction />}
      <Footer minimal={minimal} />
    </Fragment>
  )
}
