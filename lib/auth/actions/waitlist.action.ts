'use server'

import { User } from '@/payload.types'
import { track } from '@vercel/analytics/server'
import { addContact } from './contact.action'
import { sendWelcomeEmail } from './email.action'
import { sendSlackAlert } from './send-slack-alert'

export const handleWaitlistActions = async (user: User, domain: string) => {
  const firstName = user.name?.split(' ')[0] || user.email.split('@')[0]
  const lastName = user.name?.split(' ').slice(1).join(' ') || ''

  await Promise.all([
    track('User joined waitlist', {
      name: user.name || 'unknown',
      email: user.email,
      photo: user.image || 'unknown',
      domain: domain,
    }),
    sendSlackAlert('New Waitlist Signup', {
      Name: user.name || firstName,
      Email: user.email,
      Photo: user.image || 'Not available',
      Domain: domain,
      Timestamp: new Date().toISOString(),
    }),
    addContact(user.email, firstName, lastName),
    sendWelcomeEmail({
      email: user.email,
      name: firstName,
      host: `dotdo.ai`,
    }),
  ])
}
