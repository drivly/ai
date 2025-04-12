import { WorkflowConfig } from 'payload'
import type { Webhooks } from '@octokit/webhooks'

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
        console.log('Starting research workflow')
        const issue = event.issue
        
        const researchJob = await payload.jobs.queue({
          task: 'executeFunction',
          input: {
            functionName: 'research',
            args: { 
              issue: {
                number: issue.number,
                title: issue.title,
                body: issue.body || '',
                url: issue.html_url,
                repo: event.repository?.full_name
              }
            },
            schema: {
              summary: 'string',
              findings: 'string[]',
              sources: 'string[]',
              confidence: 'number'
            },
            settings: {
              model: 'perplexity/sonar-deep-research'
            },
            type: 'Object',
            callback: {
              task: 'postGithubComment',
              input: {
                issueNumber: issue.number,
                repository: event.repository?.full_name
              }
            }
          }
        })
        
        await payload.create({ 
          collection: 'githubTasks', 
          data: { 
            issueNumber: issue.number,
            repository: event.repository?.full_name,
            jobId: researchJob.id,
            status: 'processing' 
          } 
        })
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
        Authorization: `Bearer ${process.env.DEVIN_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Devin API error (${response.status}):`, errorText)
      return { error: `API error: ${response.status}`, message: errorText }
    }

    let result
    try {
      const text = await response.text()
      result = JSON.parse(text)
      console.log('Devin session created:', result)
    } catch (parseError) {
      console.error('Failed to parse Devin API response:', parseError)
      result = { error: 'Invalid JSON response', rawResponse: await response.text() }
    }

    return result
  } catch (error) {
    console.error('Error creating Devin session:', error)
  }
}
