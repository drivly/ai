import { Footer } from '@/components/sites/footer'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import { CallToAction } from './sections/call-to-action'

export type AwaitedPageProps<TParams extends object> = {
  params: TParams
  searchParams?: { category?: string; provider?: string; order?: string }
}

type NextPageProps<TParams extends object> = {
  params: Promise<TParams>
  searchParams?: Promise<{ category?: string; provider?: string; order?: string }>
}

export const withSitesWrapper = <
  TParams extends { comparison?: string; domain?: string; event?: string; id?: string; integration?: string; path?: string; product?: string; slug?: string; lab?: string; model?: string },
>({
  WrappedPage,
  minimal = false,
  withCallToAction = true,
  explicitDomain,
}: {
  WrappedPage: React.ComponentType<AwaitedPageProps<TParams>>
  minimal?: boolean
  withCallToAction?: boolean
  explicitDomain?: string
}) => {
  return async (props: NextPageProps<TParams>) => {
    const [awaitedParams, awaitedSearchParams] = await Promise.all([props.params, props.searchParams])

    const pageProps: AwaitedPageProps<TParams> = {
      params: awaitedParams,
      searchParams: awaitedSearchParams,
    }

    return (
      <BalancerProvider>
        {/* Pass awaitedParams to SitesNavbar as it needs the resolved values */}
        <SitesNavbar params={awaitedParams ?? {}} minimal={minimal} explicitDomain={explicitDomain} />
        <main className='border-b border-gray-800/50'>
          {/* Pass the awaited props to WrappedPage */}
          <WrappedPage {...pageProps} />
        </main>
        {withCallToAction && <CallToAction />}
        <Footer minimal={minimal} />
      </BalancerProvider>
    )
  }
}
