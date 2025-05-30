'use server'

import { siteConfig } from '@/components/site-config'
import ApplyEmail from '@/emails/apply-email'
import WaitlistEmail from '@/emails/waitlist-email'
import resend from '@/lib/resend'
import { ReactNode } from 'react'

interface MagicLinkParams {
  email: string
  name: string
  host: string
}

interface ApplicationParams {
  email: string
  name: string
  position: string
}

export const sendWaitlistEmail = async (params: MagicLinkParams) => {
  const { email, name, host } = params

  await sendEmail(email, `Welcome to ${host}`, <WaitlistEmail name={name} />)
}

export const sendApplicationEmail = async (params: ApplicationParams) => {
  const { email, name, position } = params

  await sendEmail(email, `Your application for ${position} at ${siteConfig.name}`, <ApplyEmail name={name} />)
}

export const sendEmail = async (email: string, subject: string, body: ReactNode) => {
  const { error } = await resend.emails.send({
    bcc: 'sales@driv.ly',
    from: process.env.EMAIL_FROM ?? 'sales@driv.ly',
    to: [email],
    subject,
    react: <>{body}</>,
  })

  if (error) {
    throw error
  }
}
