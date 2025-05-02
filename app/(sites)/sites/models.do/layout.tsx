import { SitesNavbar } from '@/components/sites/navbar/sites-navbar'
import { CallToAction } from '@/components/sites/sections/call-to-action'
import { Footer } from '@/components/sites/footer'
import { Provider as BalancerProvider } from 'react-wrap-balancer'

export default async function Layout({ children }: { children: React.ReactNode; }) {


  return (
    <BalancerProvider>
      <SitesNavbar params={{ domain: 'models.do' }} minimal={true} />
      <main className='border-b border-gray-800/50 py-20'>
        {children}
      </main>
      <CallToAction />
      <Footer minimal={true} />
    </BalancerProvider>
  )
}