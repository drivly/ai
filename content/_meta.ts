import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  docs: { type: 'page', href: '/docs' },
  api: { type: 'page', title: 'APIs', href: '/docs/apis' },
  sdk: { type: 'page', title: 'SDKs', href: '/docs/sdks' },
  pricing: { type: 'page', href: '/pricing' },
  dashboard: { type: 'page', href: '/admin' },
  reference: { 
    type: 'page',
    title: 'API Reference',
    href: 'https://apis.do/reference'
  },

  manifesto: '',
  primitives: '',
  
  _ai: {
    type: 'separator',
    title: 'AI',
  },
  functions: '',
  agents: '',
  workflows: '',

  _: {
    type: 'separator',
  },

  business: '',
  data: '',
  events: '',
  evaluations: '',
  experiments: '',
  integrations: '',
  deployment: '',
  observability: '',
  sites: { display: 'hidden' },

  __: {
    type: 'separator',
  },




  

}

export default meta
