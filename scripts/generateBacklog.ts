import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import util from 'util'

interface GitHubIssue {
  number: number
  title: string
  state: string
  labels: string[]
  url: string
  created_at: string
}

interface CategoryMap {
  [key: string]: {
    title: string
    description?: string
    issues: GitHubIssue[]
  }
}

const categoryMap: CategoryMap = {
  'core-primitives': {
    title: 'Core Primitives',
    issues: [],
  },
  'functions-do': {
    title: 'Functions.do - Inputs to Structured Outputs',
    issues: [],
  },
  'workflows-do': {
    title: 'Workflows.do - Business-as-Code',
    issues: [],
  },
  'agents-do': {
    title: 'Agents.do - Autonomous Digital Workers',
    issues: [],
  },
  'event-system': {
    title: 'Event System',
    issues: [],
  },
  'triggers-do': {
    title: 'Triggers.do - Start Business Processes',
    issues: [],
  },
  'searches-do': {
    title: 'Searches.do - Provide Context & Understanding',
    issues: [],
  },
  'actions-do': {
    title: 'Actions.do - Impact the External World',
    issues: [],
  },
  'foundation-components': {
    title: 'Foundation Components',
    issues: [],
  },
  'llm-do': {
    title: 'LLM.do - Intelligent AI Gateway',
    issues: [],
  },
  'database-do': {
    title: 'Database.do - AI-enriched Data',
    issues: [],
  },
  'evals-do': {
    title: 'Evals.do - Measure & Improve',
    issues: [],
  },
  'integrations-do': {
    title: 'Integrations.do - Connect Your Apps',
    issues: [],
  },
  'api-experience': {
    title: 'API Experience',
    issues: [],
  },
  'apis-do': {
    title: 'APIs.do - Clickable Developer Experiences',
    issues: [],
  },
  'sdk-development': {
    title: 'SDK Development',
    issues: [],
  },
  'documentation-website': {
    title: 'Documentation & Website',
    issues: [],
  },
  docs: {
    title: 'Docs',
    issues: [],
  },
  website: {
    title: 'Website',
    issues: [],
  },
  infrastructure: {
    title: 'Infrastructure',
    issues: [],
  },
  'domain-routing': {
    title: 'Domain Routing',
    issues: [],
  },
  'analytics-monitoring': {
    title: 'Analytics & Monitoring',
    issues: [],
  },
  miscellaneous: {
    title: 'Miscellaneous',
    issues: [],
  },
  milestones: {
    title: 'Milestones',
    issues: [],
  },
}

const labelToCategoryMap: { [key: string]: string } = {
  'functions.do': 'functions-do',
  'workflows.do': 'workflows-do',
  'agents.do': 'agents-do',
  'triggers.do': 'triggers-do',
  'searches.do': 'searches-do',
  'actions.do': 'actions-do',
  'llm.do': 'llm-do',
  'database.do': 'database-do',
  'evals.do': 'evals-do',
  'integrations.do': 'integrations-do',
  'apis.do': 'apis-do',
  research: 'searches-do', // Add research label to searches-do category
  sdk: 'sdk-development',
  docs: 'docs',
  website: 'website',
  infrastructure: 'infrastructure',
  'domain-routing': 'domain-routing',
  analytics: 'analytics-monitoring',
  monitoring: 'analytics-monitoring',
  epic: 'miscellaneous', // Epics will be distributed based on other labels
}

function fetchGitHubIssues(): GitHubIssue[] {
  try {
    const openIssuesJson = execSync('gh issue list -R drivly/ai --state open --json number,title,state,labels,url,createdAt --limit 1000').toString()
    const openIssues = JSON.parse(openIssuesJson)

    const closedIssuesJson = execSync('gh issue list -R drivly/ai --state closed --json number,title,state,labels,url,createdAt --limit 1000').toString()
    const closedIssues = JSON.parse(closedIssuesJson)

    return [...openIssues, ...closedIssues].map((issue) => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      labels: issue.labels.map((label: any) => label.name),
      url: issue.url,
      created_at: issue.createdAt,
    }))
  } catch (error) {
    console.error('Error fetching GitHub issues:', error)
    return []
  }
}

function categorizeIssues(issues: GitHubIssue[]): void {
  Object.keys(categoryMap).forEach((key) => {
    categoryMap[key].issues = []
  })

  issues.forEach((issue) => {
    let categorized = false

    for (const label of issue.labels) {
      const category = labelToCategoryMap[label.toLowerCase()]
      if (category) {
        categoryMap[category].issues.push(issue)
        categorized = true
        break
      }
    }

    if (!categorized) {
      const title = issue.title.toLowerCase()

      if (title.includes('function') || title.includes('functions.do')) {
        categoryMap['functions-do'].issues.push(issue)
      } else if (title.includes('workflow') || title.includes('workflows.do')) {
        categoryMap['workflows-do'].issues.push(issue)
      } else if (title.includes('agent') || title.includes('agents.do')) {
        categoryMap['agents-do'].issues.push(issue)
      } else if (title.includes('trigger') || title.includes('triggers.do')) {
        categoryMap['triggers-do'].issues.push(issue)
      } else if (title.includes('search') || title.includes('searches.do')) {
        categoryMap['searches-do'].issues.push(issue)
      } else if (title.includes('action') || title.includes('actions.do')) {
        categoryMap['actions-do'].issues.push(issue)
      } else if (title.includes('llm') || title.includes('llm.do')) {
        categoryMap['llm-do'].issues.push(issue)
      } else if (title.includes('database') || title.includes('database.do')) {
        categoryMap['database-do'].issues.push(issue)
      } else if (title.includes('eval') || title.includes('evals.do')) {
        categoryMap['evals-do'].issues.push(issue)
      } else if (title.includes('integration') || title.includes('integrations.do')) {
        categoryMap['integrations-do'].issues.push(issue)
      } else if (title.includes('api') || title.includes('apis.do')) {
        categoryMap['apis-do'].issues.push(issue)
      } else if (title.includes('sdk')) {
        categoryMap['sdk-development'].issues.push(issue)
      } else if (title.includes('doc')) {
        categoryMap['docs'].issues.push(issue)
      } else if (title.includes('website')) {
        categoryMap['website'].issues.push(issue)
      } else {
        categoryMap['miscellaneous'].issues.push(issue)
      }
    }
  })

  const parentChildMap: { [key: string]: string[] } = {
    'core-primitives': ['functions-do', 'workflows-do', 'agents-do'],
    'event-system': ['triggers-do', 'searches-do', 'actions-do'],
    'foundation-components': ['llm-do', 'database-do', 'evals-do', 'integrations-do'],
    'api-experience': ['apis-do'],
    'documentation-website': ['docs', 'website'],
    infrastructure: ['domain-routing', 'analytics-monitoring'],
  }

  Object.entries(parentChildMap).forEach(([parent, children]) => {
    const uniqueIssues = new Set<number>()
    children.forEach((child) => {
      categoryMap[child].issues.forEach((issue) => {
        uniqueIssues.add(issue.number)
      })
    })

    const allIssues = issues.filter((issue) => uniqueIssues.has(issue.number))
    categoryMap[parent].issues = allIssues
  })
}

function generateMarkdown(): string {
  let markdown = '# AI Primitives Platform Backlog\n\n'
  markdown += "This document organizes all open issues in the drivly/ai repository into a hierarchical structure, aligning with the platform's architecture and roadmap.\n\n"

  const topLevelCategories = [
    'core-primitives',
    'event-system',
    'foundation-components',
    'api-experience',
    'sdk-development',
    'documentation-website',
    'infrastructure',
    'miscellaneous',
    'milestones',
  ]

  topLevelCategories.forEach((categoryKey) => {
    const category = categoryMap[categoryKey]

    if (category.issues.length === 0 && !hasChildIssues(categoryKey)) {
      return
    }

    markdown += `## ${category.title}\n\n`

    if (category.description) {
      markdown += `${category.description}\n\n`
    }

    const childCategories = getChildCategories(categoryKey)
    if (childCategories.length > 0) {
      childCategories.forEach((childKey) => {
        const childCategory = categoryMap[childKey]

        if (childCategory.issues.length === 0) {
          return
        }

        markdown += `### ${childCategory.title}\n`

        if (childCategory.issues.length === 0) {
          markdown += '- *No specific issues assigned*\n\n'
        } else {
          const sortedIssues = [...childCategory.issues].sort((a, b) => b.number - a.number)

          const epicIssues = sortedIssues.filter((issue) => issue.labels.includes('epic'))
          const regularIssues = sortedIssues.filter((issue) => !issue.labels.includes('epic'))

          epicIssues.forEach((issue) => {
            markdown += `- [#${issue.number}](${issue.url}) - ${issue.title} (Epic)\n`
          })

          regularIssues.forEach((issue) => {
            markdown += `- [#${issue.number}](${issue.url}) - ${issue.title}\n`
          })

          markdown += '\n'
        }
      })
    } else {
      if (category.issues.length === 0) {
        markdown += '- *No specific issues assigned*\n\n'
      } else {
        const sortedIssues = [...category.issues].sort((a, b) => b.number - a.number)

        const epicIssues = sortedIssues.filter((issue) => issue.labels.includes('epic'))
        const regularIssues = sortedIssues.filter((issue) => !issue.labels.includes('epic'))

        epicIssues.forEach((issue) => {
          markdown += `- [#${issue.number}](${issue.url}) - ${issue.title} (Epic)\n`
        })

        regularIssues.forEach((issue) => {
          markdown += `- [#${issue.number}](${issue.url}) - ${issue.title}\n`
        })

        markdown += '\n'
      }
    }
  })

  return markdown
}

function hasChildIssues(categoryKey: string): boolean {
  const childCategories = getChildCategories(categoryKey)
  return childCategories.some((childKey) => categoryMap[childKey].issues.length > 0)
}

function getChildCategories(parentKey: string): string[] {
  switch (parentKey) {
    case 'core-primitives':
      return ['functions-do', 'workflows-do', 'agents-do']
    case 'event-system':
      return ['triggers-do', 'searches-do', 'actions-do']
    case 'foundation-components':
      return ['llm-do', 'database-do', 'evals-do', 'integrations-do']
    case 'api-experience':
      return ['apis-do']
    case 'documentation-website':
      return ['docs', 'website']
    case 'infrastructure':
      return ['domain-routing', 'analytics-monitoring']
    default:
      return []
  }
}

async function updateRoadmapComment(markdown: string): Promise<void> {
  try {
    console.log('Generating roadmap comment for issue #3...')

    const commentsJson = execSync('gh issue view 3 -R drivly/ai --json comments').toString()
    const comments = JSON.parse(commentsJson).comments || []

    const existingComment = comments.find((comment: any) => comment.body.includes('## ROADMAP STATUS UPDATE'))

    const commentBody = `## ROADMAP STATUS UPDATE

This comment is automatically generated by the \`generateBacklog.ts\` script. It contains the current roadmap status with identified gaps.

${markdown}

## How to use this comment

### Identifying gaps in the roadmap
Gaps are marked with 🔴 and represent areas that need attention.

### Creating new issues from markdown
To create a new issue from this comment, add a line in the following format:
\`\`\`
NEW ISSUE: [Category] Issue title | Issue description
\`\`\`

For example:
\`\`\`
NEW ISSUE: [Searches.do] Implement search capabilities API | Create the API endpoints for search capabilities
\`\`\`
`

    if (existingComment) {
      console.log(`Updating existing comment (using new comment)...`)
      execSync(`gh issue comment 3 -R drivly/ai --body "${commentBody.replace(/"/g, '\\"').replace(/`/g, '\\`')}"`)
    } else {
      console.log('Creating new comment...')
      execSync(`gh issue comment 3 -R drivly/ai --body "${commentBody.replace(/"/g, '\\"').replace(/`/g, '\\`')}"`)
    }

    console.log('Roadmap comment has been updated successfully!')
  } catch (error) {
    console.error('Error updating roadmap comment:', error)
  }
}

function generateRoadmapMarkdown(categoryMap: CategoryMap): string {
  const roadmapContent = fs.readFileSync(path.join(process.cwd(), 'ROADMAP.md'), 'utf-8')

  const gapsSection = roadmapContent.split('## Identified Gaps')[1]?.split('##')[0]?.trim()

  let markdown = '# Current Roadmap Status\n\n'

  const componentsWithNoIssues = Object.entries(categoryMap)
    .filter(([_, category]) => category.issues.length === 0)
    .map(([key, category]) => ({ key, title: category.title }))

  markdown += '## Components Needing Issues\n\n'

  if (componentsWithNoIssues.length === 0) {
    markdown += '- All components have assigned issues! 🎉\n\n'
  } else {
    componentsWithNoIssues.forEach(({ key, title }) => {
      markdown += `- 🔴 **${title}** - No specific issues are currently assigned to this component\n`
    })
    markdown += '\n'
  }

  if (gapsSection) {
    markdown += '## Documented Gaps\n\n'
    markdown += gapsSection
    markdown += '\n\n'
  }

  try {
    const closedIssuesJson = execSync('gh issue list -R drivly/ai --state closed --json number,title,closedAt --limit 10').toString()
    const closedIssues = JSON.parse(closedIssuesJson)

    const recentClosedIssues = closedIssues.sort((a: any, b: any) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime()).slice(0, 5)

    if (recentClosedIssues.length > 0) {
      markdown += '## Recent Progress\n\n'
      markdown += 'Recently closed issues:\n\n'

      recentClosedIssues.forEach((issue: any) => {
        markdown += `- [#${issue.number}](https://github.com/drivly/ai/issues/${issue.number}) - ${issue.title}\n`
      })

      markdown += '\n'
    }
  } catch (error) {
    console.error('Error fetching closed issues:', error)
  }

  return markdown
}

async function createIssuesFromComment(): Promise<void> {
  try {
    console.log('Checking for new issues to create from comment...')

    const commentsJson = execSync('gh issue view 3 -R drivly/ai --json comments').toString()
    const comments = JSON.parse(commentsJson).comments || []

    const roadmapComment = comments.find((comment: any) => comment.body.includes('## ROADMAP STATUS UPDATE'))

    if (!roadmapComment) {
      console.log('No roadmap comment found. Skipping issue creation.')
      return
    }

    const newIssueLines = roadmapComment.body.split('\n').filter((line: string) => line.startsWith('NEW ISSUE:'))

    if (newIssueLines.length === 0) {
      console.log('No new issues to create.')
      return
    }

    for (const line of newIssueLines) {
      const matches = line.match(/NEW ISSUE: \[(.*?)\] (.*?) \| (.*)/)

      if (!matches || matches.length < 4) {
        console.log(`Could not parse issue line: ${line}`)
        continue
      }

      const [_, category, title, description] = matches
      const labelMatch = Object.entries(labelToCategoryMap).find(([label, cat]) => cat.toLowerCase() === category.toLowerCase() || label.toLowerCase() === category.toLowerCase())

      const labelArg = labelMatch ? `--label "${labelMatch[0]}"` : ''

      console.log(`Creating issue: ${title}`)
      const result = execSync(`gh issue create -R drivly/ai --title "${title}" --body "${description}" ${labelArg}`).toString()

      console.log(`Issue created: ${result.trim()}`)

      const updatedBody = roadmapComment.body.replace(line, `✅ CREATED: ${result.trim()} (was: ${line})`)

      execSync(`gh issue comment 3 -R drivly/ai --body "${updatedBody.replace(/"/g, '\\"').replace(/`/g, '\\`')}"`)
    }

    console.log('Finished checking for new issues.')
  } catch (error) {
    console.error('Error creating issues from comment:', error)
  }
}

async function main() {
  console.log('Fetching GitHub issues...')
  const issues = fetchGitHubIssues()
  console.log(`Fetched ${issues.length} issues`)

  console.log('Categorizing issues...')
  categorizeIssues(issues)

  console.log('Generating markdown...')
  const markdown = generateMarkdown()

  console.log('Writing to BACKLOG.md...')
  fs.writeFileSync(path.join(process.cwd(), 'BACKLOG.md'), markdown)

  console.log('BACKLOG.md has been updated successfully!')

  const roadmapMarkdown = generateRoadmapMarkdown(categoryMap)
  await updateRoadmapComment(roadmapMarkdown)

  await createIssuesFromComment()
}

main()
