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


## [functions.do](https://functions.do) Inputs to Structured Outputs



## [agents.do](https://agents.do) Autonomous Digital Workers



## [integrations.do](https://integrations.do) Connect Your Apps



## [triggers.do](https://triggers.do) Start Business Processes



## [searches.do](https://searches.do) Provide Context & Understanding



## [actions.do](https://actions.do) Impact the External World


## [nouns.do](https://nouns.do) Entities in Your Business


## [verbs.do](https://verbs.do) Represent Potential Actions


## [things.do](https://things.do) Physical and Virtual Objects


## [actions.do](https://actions.do) Subject-Verb-Object


## [database.do](https://database.do) AI-enriched Data


## [events.do](https://events.do) Track Business Events


## [experiments.do](https://experiments.do) Iterate & Improve


## [benchmarks.do](https://benchmarks.do) Compare Models


## [evals.do](https://evals.do) Measure & Improve


## [traces.do](https://traces.do) Operational Visibility


## [llm.do](https://llm.do) Tool-enabled Proxy



## [analytics.do](https://analytics.do) Insightful Business Intelligence

