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

const leanCanvas = await ai.leanCanvas({ idea: 'Agentic Workflow Platform', icp: 'Alpha Devs & Empowered CTOs' })

console.log(leanCanvas)
//
//
//
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
    "入 Functions - Typesafe Results without Complexity": "https://functions.do/api",
    "巛 Workflows - Reliably Execute Business Processes": "https://workflows.do/api",
    "回 Agents - Deploy & Manage Autonomous Digital Workers": "https://agents.do/api"
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