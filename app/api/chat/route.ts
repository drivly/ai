import createChatRoute from '@drivly/payload-agent/api'

export const maxDuration = 30

const chatRoute = createChatRoute({
  model: 'gpt-4o',
})

export { chatRoute as GET, chatRoute as POST }
