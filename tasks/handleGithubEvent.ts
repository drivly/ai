import { WorkflowConfig } from 'payload'
import type { Webhooks } from '@octokit/webhooks'
import fetch from 'node-fetch'

export const handleGithubEvent = {
  retries: 3,
  slug: 'handleGithubEvent',
  label: 'Handle Github Event',
  inputSchema: [{ name: 'payload', type: 'json', required: true }],
  handler: async ({ job, tasks, req }: any) => {
    // TODO: Figure out the correct type for Github Webhooks
    const event = job.input.payload as any
    const { payload } = req
    
    if (event.action === 'labeled') {
      console.log('Label added:', event.label?.name)
      if (event.label?.name === 'research') {
        // TODO: Kick off a research workflow using Perplexity Deep Research
        console.log('Starting research workflow')
      } else if (event.label?.name === 'devin') {
        console.log('Starting Devin workflow')
        await createDevinSession(event)
      }
    }

    const results = await payload.create({ collection: 'events', data: { data: event } })
    console.log('Event saved to database:', results)
    
  },
} as WorkflowConfig<'handleGithubEvent'>

async function createDevinSession(event: any) {
  try {
    const issue = event.issue
    if (!issue) {
      console.error('No issue found in the event payload')
      return
    }

    const issueNumber = issue.number
    const issueTitle = issue.title
    const issueBody = issue.body || ''
    const issueUrl = issue.html_url
    const repositoryUrl = event.repository?.html_url
    
    const prompt = `
      Please create a new branch and PR to solve the following GitHub issue:
      
      Issue #${issueNumber}: ${issueTitle}
      
      ${issueBody}
      
      Issue URL: ${issueUrl}
      
      Repository: ${repositoryUrl}
      
      Instructions:
      1. Create a new branch
      2. Implement the requested changes
      3. Include "resolves #${issueNumber}" in all commit messages and PR descriptions
      4. Create a pull request back to the main branch
    `.trim()

    const response = await fetch('https://api.devin.ai/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEVIN_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    })

    const result = await response.json()
    console.log('Devin session created:', result)
    return result
  } catch (error) {
    console.error('Error creating Devin session:', error)
  }
}
