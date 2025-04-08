import { Pricing } from '@/components/sites/pages/pricing'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'

async function PricingPage(props: { params: Promise<{ domain: string }> }) {
  const { domain } = await props.params

  return <Pricing />
}

export default withSitesWrapper(PricingPage, false, false)
