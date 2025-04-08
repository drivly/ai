import { Footer } from '@/components/sites/footer'
import { Fragment } from 'react'

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      {children}
      <Footer />
    </Fragment>
  )
}
