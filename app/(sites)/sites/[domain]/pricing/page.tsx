import { Pricing } from './pricing'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'

export default withSitesWrapper({ WrappedPage: Pricing, withCallToAction: false })
