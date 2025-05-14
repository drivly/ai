import { TaskConfig } from 'payload'

/**
 * Process a code function using esbuild
 *
 * This task is triggered when a function with type "Code" is created or updated
 * It processes the code using esbuild and creates/updates the corresponding module and package
 */
export const processCodeFunction = async ({ input, payload }: any) => {
  const { functionId } = input

  if (!functionId) {
    throw new Error('Function ID is required')
  }

  try {
    const func = await payload.findByID({
      collection: 'functions',
      id: functionId,
    })

    if (!func || func.type !== 'Code' || !func.code) {
      throw new Error('Function not found or not a Code type function')
    }

    const bundledCode = func.code

    const moduleData = {
      name: func.name,
    }

    const { docs: existingModules } = await payload.find({
      collection: 'modules',
      where: {
        name: {
          equals: func.name,
        },
      },
      limit: 1,
    })

    let moduleId
    if (existingModules.length > 0) {
      const updated = await payload.update({
        collection: 'modules',
        id: existingModules[0].id,
        data: moduleData,
      })
      moduleId = updated.id
    } else {
      const created = await payload.create({
        collection: 'modules',
        data: moduleData,
      })
      moduleId = created.id
    }

    const packageData = {
      name: func.name,
    }

    const { docs: existingPackages } = await payload.find({
      collection: 'packages',
      where: {
        name: {
          equals: func.name,
        },
      },
      limit: 1,
    })

    let packageId
    if (existingPackages.length > 0) {
      const updated = await payload.update({
        collection: 'packages',
        id: existingPackages[0].id,
        data: packageData,
      })
      packageId = updated.id
    } else {
      const created = await payload.create({
        collection: 'packages',
        data: packageData,
      })
      packageId = created.id
    }

    return {
      function: func.name,
      moduleId,
      packageId,
      success: true,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error processing code function:', errorMessage)
    return {
      error: errorMessage,
      success: false,
    }
  }
}

export const processCodeFunctionTask = {
  retries: 3,
  slug: 'processCodeFunction',
  label: 'Process Code Function',
  inputSchema: [{ name: 'functionId', type: 'text', required: true }],
  outputSchema: [
    { name: 'function', type: 'text' },
    { name: 'moduleId', type: 'text' },
    { name: 'packageId', type: 'text' },
    { name: 'success', type: 'checkbox' },
    { name: 'error', type: 'text' },
  ],
  handler: processCodeFunction,
} as unknown as TaskConfig
