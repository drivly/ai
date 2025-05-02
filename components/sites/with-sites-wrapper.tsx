import { Footer } from '@/components/sites/footer'
import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import { CallToAction } from './sections/call-to-action'

type AwaitedPageProps<TParams extends object> = {
  params: TParams
  searchParams?: { [key: string]: string | string[] | undefined }
}

type NextPageProps<TParams extends object> = {
  params: Promise<TParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const withSitesWrapper = <
  TParams extends { comparison?: string; domain?: string; event?: string; id?: string; integration?: string; path?: string; product?: string; slug?: string },
>({
  WrappedPage,
  minimal = false,
  withCallToAction = true,
}: {
  WrappedPage: React.ComponentType<AwaitedPageProps<TParams>>
  minimal?: boolean
  withCallToAction?: boolean
}) => {
  return async (props: NextPageProps<TParams>) => {
    const [awaitedParams] = await Promise.all([props.params])

    const pageProps: AwaitedPageProps<TParams> = {
      params: awaitedParams,
    }

    return (
      <BalancerProvider>
        {/* Pass awaitedParams to SitesNavbar as it needs the resolved values */}
        <SitesNavbar params={awaitedParams} minimal={minimal} />
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
