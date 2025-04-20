import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url }) => {
  // Using the new db interface for more concise syntax
  const agents = await db.agents.find()

  return { agents }
})

export const POST = API(async (request, { db, user, url }) => {
  const { action, agentId } = await request.json()

  if (action === 'clone' && agentId) {
    const originalAgent = await db.agents.get(agentId)

    if (!originalAgent) {
      return { error: 'Agent not found' }
    }

    if (!originalAgent.public && originalAgent.user?.id !== user?.id) {
      return { error: 'You do not have permission to clone this agent' }
    }

    const cloneData = {
      ...originalAgent,
      name: `${originalAgent.name} (Clone)`,
      clonedFrom: agentId,
      isPublic: false, // Default to private
      pricing: {
        isMonetized: false, // Default to not monetized
      },
      user: user?.id, // Set the current user as the owner
    }

    delete cloneData.id
    delete cloneData.createdAt
    delete cloneData.updatedAt
    delete cloneData.stripeProductId
    delete cloneData.stripePriceId

    const newAgent = await db.agents.create(cloneData)

    return { success: true, agent: newAgent }
  }

  return { error: 'Invalid action' }
})
