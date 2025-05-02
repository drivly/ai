'use server'

import { ExtendedUser } from '@/auth'
import { track } from '@vercel/analytics/server'
import { addContact } from './contact.action'
import { sendWaitlistEmail } from './email.action'
import { sendSlackAlert } from './slack.action'

export const handleWaitlistActions = async (user: ExtendedUser, domain: string) => {
  const firstName = user.name?.split(' ')[0] || user.email?.split('@')[0] || ''
  const lastName = user.name?.split(' ').slice(1).join(' ') || ''
  const email = user.email || user.github?.email || ''

  try {
    await track('User joined waitlist', {
      name: user.name || 'unknown',
      email,
      photo: user.image || 'unknown',
      domain: domain,
    })
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }

  try {
    await sendSlackAlert('waitlist', {
      Name: user.name || firstName,
      Email: email,
      Photo: user.image || 'unknown',
      Profile: user.github?.profileUrl,
      Domain: domain,
      Timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Slack alert failed:', error)
  }

  try {
    await addContact(email, firstName, lastName)
  } catch (error) {
    console.error('Contact creation failed:', error)
  }

  try {
    await sendWaitlistEmail({
      email,
      name: firstName,
      host: `dotdo.ai`,
    })
  } catch (error) {
    console.error('Welcome email failed:', error)
  }
}
