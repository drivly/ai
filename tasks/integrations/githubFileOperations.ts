import { Octokit } from '@octokit/rest'
import { TaskConfig } from 'payload'
import { createHash } from 'crypto'

interface GitHubFileOperationsInput {
  repository: string // Format: owner/repo
  branch?: string
  path: string
  content?: string
  message?: string
  operation: 'read' | 'write' | 'delete' | 'list'
  createPR?: boolean
  prTitle?: string
  prBody?: string
}

export const githubFileOperations = {
  slug: 'githubFileOperations',
  label: 'GitHub File Operations',
  inputSchema: [
    { name: 'repository', type: 'text', required: true },
    { name: 'branch', type: 'text' },
    { name: 'path', type: 'text', required: true },
    { name: 'content', type: 'text' },
    { name: 'message', type: 'text' },
    { name: 'operation', type: 'text', required: true },
    { name: 'createPR', type: 'boolean' },
    { name: 'prTitle', type: 'text' },
    { name: 'prBody', type: 'text' },
  ],
  outputSchema: [
    { name: 'success', type: 'boolean' },
    { name: 'data', type: 'json' },
    { name: 'error', type: 'text' },
  ],
  handler: async ({ input, payload }: { input: GitHubFileOperationsInput; payload: any }) => {
    try {
      const { repository, branch = 'main', path, content, message, operation, createPR, prTitle, prBody } = input
      const [owner, repo] = repository.split('/')

      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

      let result: any = { success: false }
      let sha: string | undefined

      if (operation === 'write' || operation === 'delete') {
        try {
          const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path,
            ref: branch,
          })

          if (!Array.isArray(data)) {
            sha = data.sha
          }
        } catch (error) {
          if (operation === 'delete') {
            return {
              success: false,
              error: `File ${path} not found in ${repository}`,
            }
          }
        }
      }

      switch (operation) {
        case 'read':
          try {
            const { data } = await octokit.repos.getContent({
              owner,
              repo,
              path,
              ref: branch,
            })

            if (Array.isArray(data)) {
              result = {
                success: true,
                data: data.map((item) => ({
                  name: item.name,
                  path: item.path,
                  type: item.type,
                  size: item.size,
                  sha: item.sha,
                  url: item.html_url,
                })),
              }
            } else {
              const fileData = data as { content: string }
              const content = Buffer.from(fileData.content, 'base64').toString('utf-8')
              const contentHash = createHash('sha256').update(content).digest('hex')

              result = {
                success: true,
                data: {
                  content,
                  contentHash,
                  sha: data.sha,
                  size: data.size,
                  url: data.html_url,
                },
              }
            }
          } catch (error) {
            result = {
              success: false,
              error: `Failed to read ${path} from ${repository}: ${error instanceof Error ? error.message : String(error)}`,
            }
          }
          break

        case 'write':
          try {
            const defaultMessage = sha ? `Update ${path} [.ai sync]` : `Create ${path} [.ai sync]`

            const { data } = await octokit.repos.createOrUpdateFileContents({
              owner,
              repo,
              path,
              message: message || defaultMessage,
              content: Buffer.from(content || '').toString('base64'),
              sha,
              branch,
            })

            result = {
              success: true,
              data: {
                commit: data.commit,
                contentHash: createHash('sha256')
                  .update(content || '')
                  .digest('hex'),
              },
            }

            if (createPR && data) {
              const prResult = await octokit.pulls.create({
                owner,
                repo,
                title: prTitle || `Update ${path} [.ai sync]`,
                body: prBody || `This PR contains changes from .ai folder sync operation.\n\nUpdated file: ${path}`,
                head: branch,
                base: 'main',
              })

              result.data.pr = {
                number: prResult.data.number,
                url: prResult.data.html_url,
              }
            }
          } catch (error) {
            result = {
              success: false,
              error: `Failed to write to ${path} in ${repository}: ${error instanceof Error ? error.message : String(error)}`,
            }
          }
          break

        case 'delete':
          try {
            if (!sha) {
              throw new Error(`File ${path} not found`)
            }

            const { data } = await octokit.repos.deleteFile({
              owner,
              repo,
              path,
              message: message || `Delete ${path} [.ai sync]`,
              sha,
              branch,
            })

            result = {
              success: true,
              data: {
                commit: data.commit,
              },
            }

            if (createPR && data) {
              const prResult = await octokit.pulls.create({
                owner,
                repo,
                title: prTitle || `Delete ${path} [.ai sync]`,
                body: prBody || `This PR removes file ${path} from .ai folder sync operation.`,
                head: branch,
                base: 'main',
              })

              result.data.pr = {
                number: prResult.data.number,
                url: prResult.data.html_url,
              }
            }
          } catch (error) {
            result = {
              success: false,
              error: `Failed to delete ${path} from ${repository}: ${error instanceof Error ? error.message : String(error)}`,
            }
          }
          break

        case 'list':
          try {
            const { data } = await octokit.repos.getContent({
              owner,
              repo,
              path,
              ref: branch,
            })

            if (Array.isArray(data)) {
              result = {
                success: true,
                data: data.map((item) => ({
                  name: item.name,
                  path: item.path,
                  type: item.type,
                  size: item.size,
                  sha: item.sha,
                  url: item.html_url,
                })),
              }
            } else {
              result = {
                success: false,
                error: `Path ${path} is not a directory`,
              }
            }
          } catch (error) {
            result = {
              success: false,
              error: `Failed to list directory ${path} in ${repository}: ${error instanceof Error ? error.message : String(error)}`,
            }
          }
          break

        default:
          result = {
            success: false,
            error: `Invalid operation: ${operation}`,
          }
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  },
} as unknown as TaskConfig
