# [Workflows.do](https://workflows.do) Business-as-Code

```typescript
import { AI } from 'workflows.do'

export default AI({

  onUserSignup: async ({ ai, api, db, event }) => {

    const { name, email, company } = event

    // Enrich content details with lookup from external data sources
    const enrichedContact = await api.apollo.search({ name, email, company })
    const socialProfiles = await api.peopleDataLabs.findSocialProfiles({ name, email, company })
    const githubProfile = socialProfiles.github ? await api.github.profile({ name, email, company, profile: socialProfiles.github }) : undefined

    // Using the enriched contact details, do deep research on the company and personal background
    const companyProfile = await ai.researchCompany({ company })
    const personalProfile = await ai.researchPersonalBackground({ name, email, enrichedContact })
    const socialActivity = await ai.researchSocialActivity({ name, email, enrichedContact, socialProfiles })
    const githubActivity = githubProfile ? await ai.summarizeGithubActivity({ name, email, enrichedContact, githubProfile }) : undefined

    // Schedule a highly personalized sequence of emails to optimize onboarding and activation
    const emailSequence = await ai.personalizeEmailSequence({ name, email, company, personalProfile, socialActivity, companyProfile, githubActivity })
    await api.scheduleEmails({ emailSequence })

    // Summarize everything, save to the database, and post to Slack
    const details = { enrichedContact, socialProfiles, githubProfile, companyProfile, personalProfile, socialActivity, githubActivity, emailSequence }
    const summary = await ai.summarizeContent({ length: '3 sentences', name, email, company, ...details })
    const { url } = await db.users.create({ name, email, company, summary, ...details })
    await api.slack.postMessage({ channel: '#signups', content: { name, email, company, summary, url } })

  },
})
```


## [Functions.do](https://functions.do) Inputs to Structured Outputs

```typescript
import { AI } from 'functions.do'

const ai = AI({

  leanCanvas: {
    productName: 'name of the product or service',
    problem: ['top 3 problems the product solves'],
    solution: ['top 3 solutions the product offers'],
    uniqueValueProposition: 'clear message that states the benefit of your product',
    unfairAdvantage: 'something that cannot be easily copied or bought',
    customerSegments: ['list of target customer segments'],
    keyMetrics: ['list of key numbers that tell you how your business is doing'],
    channels: ['path to customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
    recommendations: ['list of recommendations based on the analysis'],
  }

})

const businessModel = await ai.leanCanvas({ 
  idea: 'Agentic Workflow Platform', 
  icp: 'Alpha Devs & Empowered CTOs',
})

console.log(businessModel)
{
  productName: 'Agentic Workflow Platform',
  problem: [
    'Developers spend significant time managing workflows rather than focusing on core coding tasks',
    'Difficulty integrating and automating diverse developer tools and platforms',
    'Lack of flexible, intelligent automation tools tailored specifically for advanced developer needs'
  ],
  solution: [
    'Unified platform enabling seamless integration and automation of developer workflows',
    'Agentic AI assistants automate routine development tasks, reducing manual overhead',
    'Highly customizable workflows allowing advanced developers and CTOs to rapidly adapt their processes'
  ],
  uniqueValueProposition: 'Empower alpha developers and CTOs to achieve peak productivity with intelligent, agent-driven workflow automation.',
  unfairAdvantage: 'Proprietary agentic AI technology optimized for complex software development processes, difficult to replicate without deep technical expertise.',
  customerSegments: [
    'Alpha developers seeking advanced workflow automation tools',
    'Empowered CTOs looking to streamline development processes',
    'High-performing development teams in technology-forward organizations'
  ],
  keyMetrics: [
    'Number of automated tasks executed per user',
    'Developer time saved per week',
    'Customer retention rate',
    'User adoption rate among target customer segments'
  ],
  channels: [
    'Direct outreach and sales to CTOs',
    'Developer communities and forums',
    'Tech industry events and conferences',
    'Strategic partnerships with developer tool platforms'
  ],
  costStructure: [
    'AI development and infrastructure costs',
    'Platform maintenance and cloud hosting',
    'Marketing and direct sales expenses',
    'Research and development'
  ],
  revenueStreams: [
    'Monthly subscription fees based on team size',
    'Premium feature upgrades',
    'Enterprise-level customization and integration services'
  ],
  recommendations: [
    'Establish early strategic partnerships with leading developer tools to accelerate adoption',
    'Implement feedback loops with alpha devs and CTOs to rapidly iterate and refine the agentic AI workflows',
    'Prioritize transparent pricing and clear ROI demonstrations to convert skeptical advanced developer audiences'
  ]
}
```


## [APIs.do](https://apis.do) Clickable Developer Experiences

```json
{
  "api": {
    "name": "apis.do",
    "description": "Economically valuable work delivered through simple APIs",
    "home": "https://apis.do",
    "login": "https://apis.do/login",
    "signup": "https://apis.do/signup",
    "admin": "https://apis.do/admin",
    "docs": "https://apis.do/docs",
    "repo": "https://github.com/drivly/ai",
    "with": "https://apis.do",
    "from": "https://agi.do"
  },
  "ai": {
    "Functions - Typesafe Results without Complexity": "https://functions.do/api",
    "Workflows - Reliably Execute Business Processes": "https://workflows.do/api",
    "Agents - Deploy & Manage Autonomous Digital Workers": "https://agents.do/api"
  },
  "things": {
    "Nouns - People, Places, Things, and Ideas": "https://nouns.do",
    "Verbs - The Actions Performed to and by Nouns": "https://verbs.do"
  },
  "events": {
    "Triggers - Initiate workflows based on events": "https://triggers.do",
    "Searches - Query and retrieve data": "https://searches.do",
    "Actions - Perform tasks within workflows": "https://actions.do"
  },
  "core": {
    "LLM - Intelligent AI Gateway": "https://llm.do",
    "Evals - Evaluate Functions, Workflows, and Agents": "https://evals.do",
    "Analytics - Economically Validate Workflows": "https://analytics.do",
    "Experiments - Economically Validate Workflows": "https://experiments.do",
    "Database - AI Native Data Access (Search + CRUD)": "https://database.do",
    "Integrations - Connect External APIs and Systems": "https://integrations.do"
  },
  "user": {
    "email": "me@agi.do"
  }
}
```



## [Agents.do](https://agents.do) Autonomous Digital Workers



## [Integrations.do](https://integrations.do) Connect Your Apps



## [Triggers.do](https://triggers.do) Start Business Processes



## [Searches.do](https://searches.do) Provide Context & Understanding



## [Actions.do](https://actions.do) Impact the External World


## [Nouns.do](https://nouns.do) Entities in Your Business


## [Verbs.do](https://verbs.do) Represent Potential Actions


## [Things.do](https://things.do) Physical and Virtual Objects


## [Actions.do](https://actions.do) Subject-Verb-Object


## [Database.do](https://database.do) AI-enriched Data


## [Events.do](https://events.do) Track Business Events


## [Experiments.do](https://experiments.do) Iterate & Improve


## [Benchmarks.do](https://benchmarks.do) Compare Models


## [Evals.do](https://evals.do) Measure & Improve


## [Traces.do](https://traces.do) Operational Visibility


## [LLM.do](https://llm.do) Tool-enabled Proxy



## [Analytics.do](https://analytics.do) Insightful Business Intelligence


## [AGI.do](https://agi.do) Economically Valuable Work