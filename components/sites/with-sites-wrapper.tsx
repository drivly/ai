import { Footer } from '@/components/sites/footer'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { Fragment } from 'react'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import { CallToAction } from './sections/call-to-action'
// import { Faqs } from './sections/faqs'

type AwaitedPageProps<TParams extends object> = {
  params: TParams
  searchParams?: { [key: string]: string | string[] | undefined }
}

type NextPageProps<TParams extends object> = {
  params: Promise<TParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const withSitesWrapper = <TParams extends { domain?: string; slug?: string }>({
  WrappedPage,
  minimal = false,
  withCallToAction = true,
}: {
  WrappedPage: React.ComponentType<AwaitedPageProps<TParams>>
  minimal?: boolean
  withCallToAction?: boolean
}) => {
  return async (props: NextPageProps<TParams>) => {
    const [awaitedParams, awaitedSearchParams] = await Promise.all([
      props.params,
      props.searchParams || Promise.resolve(undefined), // Provide a default resolved promise if searchParams is undefined
    ])

    const pageProps: AwaitedPageProps<TParams> = {
      params: awaitedParams,
      searchParams: awaitedSearchParams,
    }

    return (
      <BalancerProvider>
        {/* Pass awaitedParams to SitesNavbar as it needs the resolved values */}
        <SitesNavbar params={awaitedParams} minimal={minimal} />
        <main className='flex-1 overflow-x-hidden border-b border-gray-800/50'>
          {/* Pass the awaited props to WrappedPage */}
          <WrappedPage {...pageProps} />
        </main>
        {withCallToAction && <CallToAction />}
        <Footer minimal={minimal} />

        {/* Add hidden iframe for cross-domain auth */}
        <iframe src='/login' style={{ display: 'none' }} title='Authentication sync' aria-hidden='true' />
      </BalancerProvider>
    )
  }
}
