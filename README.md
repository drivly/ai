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

const brand = await ai.storyBrand({ 
  idea: 'Agentic Workflow Platform', 
  icp: 'Alpha Devs & Empowered CTOs',
})

console.log(brand)
// {
//   storyBrand: {
//     hero: {
//       identity: 'Alpha developers and empowered CTOs',
//       desire: 'To effortlessly build and deploy intelligent, scalable, agent-driven workflows'
//     },
//     problem: {
//       external: 'Current workflow solutions lack flexibility, autonomy, and speed.',
//       internal: 'Frustrated by bottlenecks, repetitive tasks, and slow development cycles.',
//       philosophical: 'Innovative developers and CTOs deserve tools designed to empower, not constrain.',
//       villain: 'Leaky abstractions',
//     },
//     guide: {
//       empathy: 'We understand the frustration of wasting your team\'s talent on mundane tasks.',
//       authority: 'Workflows.do is trusted by leading tech teams to automate millions of critical tasks with ease.'
//     },
//     plan: {
//       step1: 'Design workflows easily with our intuitive, agentic builder.',
//       step2: 'Deploy seamlessly to a scalable, fully-managed runtime.',
//       step3: 'Monitor and optimize workflows with powerful observability tools.'
//     },
//     callToAction: {
//       direct: 'Request Early Access',
//       transitional: 'Learn More'
//     },
//     failure: [
//       'Remain stuck with inefficient manual workflows.',
//       'Lose competitive advantage due to slower innovation.',
//       'Experience burnout and high turnover of talented developers.'
//     ],
//     success: [
//       'Launch sophisticated workflows quickly, without friction.',
//       'Free your team from repetitive tasks to focus on high-value innovation.',
//       'Accelerate your organization\'s growth and competitive edge.'
//     ],
//     transformation: {
//       from: 'Overwhelmed by rigid, manual processes slowing innovation',
//       to: 'Empowered to rapidly deploy autonomous workflows that drive innovation and growth'
//     },
//     oneLiner: 'Workflows.do empowers alpha devs and visionary CTOs to effortlessly create autonomous workflows, unlocking next-level productivity and innovation.'
//   }
// }
```

<details>
## Hello from the inside
</details>

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

```typescript
import { DB } from 'database.do'

const db = DB({
  posts: {
    title: 'text',
    content: 'richtext',
    status: 'Draft | Published | Archived', // Select field with predefined options
    contentType: 'Text | Markdown | Code | Object | Schema', // Another select field example
    tags: 'tags[]',
    author: 'authors'
  },
  tags: {
    name: 'text',
    posts: '<-posts.tags'  // Join field to posts (reverse relation)
  },
  authors: {
    name: 'text',
    email: 'email',
    role: 'Admin | Editor | Writer', // Select field with predefined options
    posts: '<-posts.author'  // Join field to posts (reverse relation)
  }
})
```

## [Events.do](https://events.do) Track Business Events


## [Experiments.do](https://experiments.do) Iterate & Improve


## [Benchmarks.do](https://benchmarks.do) Compare Models


## [Evals.do](https://evals.do) Measure & Improve


## [Traces.do](https://traces.do) Operational Visibility


## [LLM.do](https://llm.do) Tool-enabled Proxy



## [Analytics.do](https://analytics.do) Insightful Business Intelligence


## [AGI.do](https://agi.do) Economically Valuable Work


## Versioning Strategy

This repository uses [Changesets](https://github.com/changesets/changesets) for managing versions and publishing packages.

- Packages in the `sdks` folder are versioned together. When one SDK needs a version update, all SDKs get the same version.
- Packages in the `pkgs` folder are versioned independently based on changes.

### Adding a changeset

To add a changeset, run:

```bash
pnpm changeset
```

This will guide you through the process of creating a changeset file that describes your changes.
