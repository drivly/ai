import { Pricing } from '@/components/sites/pages/pricing'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'

async function PricingPage() {
  return <Pricing />
}

export default withSitesWrapper(PricingPage, false, false)
