import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const apiKeys = await db.apikeys.find({
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  const keysList = apiKeys.docs.map((key: any) => ({
    id: key.id,
    name: key.name,
    email: key.email,
    description: key.description,
    url: key.url,
    created: key.createdAt,
    recentUsage: {
      totalRequests: 0,
      lastUsed: null,
      topEndpoints: [],
    },
  }))

  return {
    links: {
      self: `${url.origin}/apikeys`,
      create: `${url.origin}/apikeys/create`,
      home: `${url.origin}/`,
    },
    apiKeys: keysList.reduce((acc: Record<string, any>, key: any) => {
      acc[key.name] = {
        id: key.id,
        url: `${url.origin}/apikeys/${key.id}`,
        description: key.description,
        created: key.created,
        recentUsage: key.recentUsage,
      }
      return acc
    }, {}),
  }
})
