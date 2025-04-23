'use server'

import { ExtendedUser } from '@/auth'
import { track } from '@vercel/analytics/server'
import { addContact } from './contact.action'
import { sendWelcomeEmail } from './email.action'
import { sendSlackAlert } from './send-slack-alert'

export const handleWaitlistActions = async (user: ExtendedUser, domain: string) => {
  const firstName = user.name?.split(' ')[0] || user.email?.split('@')[0] || ''
  const lastName = user.name?.split(' ').slice(1).join(' ') || ''

  try {
    await track('User joined waitlist', {
      name: user.name || 'unknown',
      email: user.email || '',
      photo: user.image || 'unknown',
      domain: domain,
    })
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }

  try {
    await sendSlackAlert('New Waitlist Signup', {
      Name: user.name || firstName,
      Email: user.email,
      Photo: user.image || 'unknown',
      Domain: domain,
      Timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Slack alert failed:', error)
  }

  try {
    await addContact(user.email || '', firstName, lastName)
  } catch (error) {
    console.error('Contact creation failed:', error)
  }

  try {
    await sendWelcomeEmail({
      email: user.email || '',
      name: firstName,
      host: `dotdo.ai`,
    })
  } catch (error) {
    console.error('Welcome email failed:', error)
  }
}
