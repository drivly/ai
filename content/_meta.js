export default {
  docs: { type: 'page', href: '/docs' },
  apis: { type: 'page', theme: { layout: 'full' } },
  sdks: { type: 'page', theme: { layout: 'full' } },
  integrations: { type: 'page', theme: { layout: 'full' } },
  dashboard: { type: 'page', href: '/admin' },
  reference: { type: 'page', href: 'https://docs.apis.do' },

  manifesto: '',
  
  _ai: {
    type: 'separator',
    title: 'AI',
  },
  workflows: '',
  functions: '',
  agents: '',

  _data: {
    type: 'separator',
    title: 'Data',
  },
  nouns: '',
  verbs: '',
  databases: { display: 'hidden' },
  resources: { display: 'hidden' },

  _business: {
    type: 'separator',
    title: 'Business',
  },
  goals: '',
  plans: { display: 'hidden' },
  tasks: '',

  _events: {
    type: 'separator',
    title: 'Events',
  },
  events: '',
  triggers: '',
  searches: '',
  actions: '',
  
  _experiments: {
    type: 'separator',
    title: 'Experiments',
  },
  analytics: '',
  experiments: '',
  benchmarks: '',
  evals: '',
  datasets: '',
  models: '',
  _7: {
    type: 'separator',
    title: 'Deploy',
  },
  code: '',
}
