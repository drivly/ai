import { WorkflowConfig } from 'payload'
import type { Webhooks } from '@octokit/webhooks'

export const handleGithubEvent = {
  retries: 3,
  slug: 'handleGithubEvent',
  label: 'Handle Github Event',
  inputSchema: [{ name: 'payload', type: 'json', required: true }],
  handler: async ({ job, tasks, req: { payload } }) => {
    // TODO: Figure out the correct type for Github Webhooks
    const event = job.input.payload as any
    if (event.action === 'labeled') {
      console.log('Label added:', event.label?.name)
      if (event.label?.name === 'research') {
        // TODO: Kick off a research workflow using Perplexity Deep Research
        console.log('Starting research workflow')
      } else if (event.label?.name === 'devin') {
        // TODO: Create a Devin session to work on this ticket
        console.log('Starting Devin workflow')
      }
    }

    // TODO: save event to database
  },
} as WorkflowConfig<'handleGithubEvent'>
