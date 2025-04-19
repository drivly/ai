import { on, every } from 'workflows.do'

on('User.Signup', async (event, { ai, api, db }) => {
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
})
