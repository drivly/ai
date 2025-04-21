import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url }) => {
  // Using the new db interface for more concise syntax
  const workflows = await db.workflows.find()
  // If we need a specific function by ID, we could use:
  // const specificFunction = await db.functions.get('function-id')

  return { workflows }
})

export const POST = API(async (request, { db, user, url }) => {
  const { action, workflowId } = await request.json()

  if (action === 'clone' && workflowId) {
    const originalWorkflow = await db.workflows.get(workflowId)

    if (!originalWorkflow) {
      return { error: 'Workflow not found' }
    }

    if (!originalWorkflow.public && originalWorkflow.user?.id !== user?.id) {
      return { error: 'You do not have permission to clone this workflow' }
    }

    const cloneData = {
      ...originalWorkflow,
      name: `${originalWorkflow.name} (Clone)`,
      clonedFrom: workflowId,
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

    const newWorkflow = await db.workflows.create(cloneData)

    return { success: true, workflow: newWorkflow }
  }

  return { error: 'Invalid action' }
})
