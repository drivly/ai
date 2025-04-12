import { Octokit } from '@octokit/rest'
import { TaskConfig } from 'payload'

export const postGithubComment = {
  slug: 'postGithubComment',
  label: 'Post GitHub Comment',
  inputSchema: [
    { name: 'issueNumber', type: 'number', required: true },
    { name: 'repository', type: 'text', required: true },
    { name: 'researchResults', type: 'json', required: true }
  ],
  handler: async ({ input, req, payload }: any) => {
    const { issueNumber, repository, researchResults } = input
    
    try {
      const comment = `## Research Results\n\n` +
        `### Summary\n${researchResults.summary}\n\n` +
        `### Key Findings\n${researchResults.findings.map((f: string) => `- ${f}`).join('\n')}\n\n` +
        `### Sources\n${researchResults.sources.map((s: string) => `- [${s}](${s})`).join('\n')}\n\n` +
        `*Confidence: ${researchResults.confidence}*`
      
      const [owner, repo] = repository.split('/')
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
      
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: comment
      })
      
      await payload.update({
        collection: 'githubTasks',
        where: {
          issueNumber: { equals: issueNumber },
          repository: { equals: repository }
        },
        data: { status: 'completed' }
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error posting GitHub comment:', error)
      
      await payload.update({
        collection: 'githubTasks',
        where: {
          issueNumber: { equals: issueNumber },
          repository: { equals: repository }
        },
        data: { status: 'failed' }
      })
      
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  }
} as unknown as TaskConfig
