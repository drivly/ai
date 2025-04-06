import mongoose from 'mongoose'
import { getPayload } from 'payload'
import config from '../payload.config'

type GraphTraversalOptions = {
  startId: string
  maxDepth?: number
  relationshipFilter?: any
}

export async function traverseGraph({ startId, maxDepth = 3, relationshipFilter = {} }: GraphTraversalOptions) {
  const payload = await getPayload({ config })

  const db = mongoose.connection.db

  const pipeline = [
    {
      $match: { _id: new mongoose.Types.ObjectId(startId) },
    },
    {
      $graphLookup: {
        from: 'relationships',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'subject',
        as: 'outgoingRelationships',
        maxDepth,
        depthField: 'depth',
        restrictSearchWithMatch: relationshipFilter,
      },
    },
    {
      $graphLookup: {
        from: 'relationships',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'object',
        as: 'incomingRelationships',
        maxDepth,
        depthField: 'depth',
        restrictSearchWithMatch: relationshipFilter,
      },
    },
    {
      $lookup: {
        from: 'resources',
        localField: 'outgoingRelationships.object',
        foreignField: '_id',
        as: 'connectedResources',
      },
    },
    {
      $lookup: {
        from: 'verbs',
        localField: 'outgoingRelationships.verb',
        foreignField: '_id',
        as: 'relationshipVerbs',
      },
    },
  ]

  try {
    if (!db) {
      throw new Error('MongoDB connection not established')
    }
    const result = await db.collection('resources').aggregate(pipeline).toArray()
    return result
  } catch (error) {
    console.error('Error traversing graph:', error)
    throw error
  }
}
