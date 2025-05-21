import XEngagementAgent from './x-engagement-agent.js'

async function main() {
  try {
    const agent = new XEngagementAgent()
    await agent.initialize()

    const result = await agent.execute({
      action: 'runFullWorkflow',
      params: {
        outputPath: 'x-tweet-proposals.md',
      },
    })

    console.log('X engagement agent execution result:', result)
  } catch (error) {
    console.error('Error running X engagement agent:', error)
  }
}

main()
