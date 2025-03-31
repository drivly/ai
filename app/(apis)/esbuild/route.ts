import { API } from '@/api.config'
import { bundleCode } from '@/pkgs/deploy-worker/src/utils/esbuild'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * ESBuild API route
 * 
 * Processes code from functions to create modules and packages
 */
export const GET = API(async ({ req, res }) => {
  const payload = await getPayload({ config })
  
  const { docs: functions } = await payload.find({
    collection: 'functions',
    where: {
      type: {
        equals: 'Code'
      }
    }
  })

  const results = []

  for (const func of functions) {
    if (!func.code) continue

    try {
      const bundledCode = await bundleCode(func.code)
      
      const moduleData = {
        name: func.name
      }
      
      const { docs: existingModules } = await payload.find({
        collection: 'modules',
        where: {
          name: {
            equals: func.name
          }
        },
        limit: 1
      })
      
      let moduleId
      if (existingModules.length > 0) {
        const updated = await payload.update({
          collection: 'modules',
          id: existingModules[0].id,
          data: moduleData
        })
        moduleId = updated.id
      } else {
        const created = await payload.create({
          collection: 'modules',
          data: moduleData
        })
        moduleId = created.id
      }
      
      const packageData = {
        name: func.name
      }
      
      const { docs: existingPackages } = await payload.find({
        collection: 'packages',
        where: {
          name: {
            equals: func.name
          }
        },
        limit: 1
      })
      
      let packageId
      if (existingPackages.length > 0) {
        const updated = await payload.update({
          collection: 'packages',
          id: existingPackages[0].id,
          data: packageData
        })
        packageId = updated.id
      } else {
        const created = await payload.create({
          collection: 'packages',
          data: packageData
        })
        packageId = created.id
      }
      
      results.push({
        function: func.name,
        moduleId,
        packageId,
        success: true
      })
    } catch (error) {
      results.push({
        function: func.name,
        error: error.message,
        success: false
      })
    }
  }
  
  return {
    processed: results.length,
    results
  }
})

/**
 * Process a specific function by ID
 */
export const POST = API(async ({ req, res, body }) => {
  const { functionId } = body || {}
  
  if (!functionId) {
    return {
      error: 'Function ID is required',
      success: false
    }
  }
  
  const payload = await getPayload({ config })
  
  try {
    const func = await payload.findByID({
      collection: 'functions',
      id: functionId
    })
    
    if (!func || func.type !== 'Code' || !func.code) {
      return {
        error: 'Function not found or not a Code type function',
        success: false
      }
    }
    
    const bundledCode = await bundleCode(func.code)
    
    const moduleData = {
      name: func.name
    }
    
    const { docs: existingModules } = await payload.find({
      collection: 'modules',
      where: {
        name: {
          equals: func.name
        }
      },
      limit: 1
    })
    
    let moduleId
    if (existingModules.length > 0) {
      const updated = await payload.update({
        collection: 'modules',
        id: existingModules[0].id,
        data: moduleData
      })
      moduleId = updated.id
    } else {
      const created = await payload.create({
        collection: 'modules',
        data: moduleData
      })
      moduleId = created.id
    }
    
    const packageData = {
      name: func.name
    }
    
    const { docs: existingPackages } = await payload.find({
      collection: 'packages',
      where: {
        name: {
          equals: func.name
        }
      },
      limit: 1
    })
    
    let packageId
    if (existingPackages.length > 0) {
      const updated = await payload.update({
        collection: 'packages',
        id: existingPackages[0].id,
        data: packageData
      })
      packageId = updated.id
    } else {
      const created = await payload.create({
        collection: 'packages',
        data: packageData
      })
      packageId = created.id
    }
    
    return {
      function: func.name,
      moduleId,
      packageId,
      success: true
    }
  } catch (error) {
    return {
      error: error.message,
      success: false
    }
  }
})
