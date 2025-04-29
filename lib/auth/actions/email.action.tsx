'use server'

import { siteConfig } from '@/components/site-config'
import ApplicationEmail from '@/emails/application-email'
import WelcomeEmail from '@/emails/welcome-email'
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

export const sendWelcomeEmail = async (params: MagicLinkParams) => {
  const { email, name, host } = params

  await sendEmail(email, `Welcome to ${host}`, <WelcomeEmail name={name} />)
}

export const sendApplicationEmail = async (params: ApplicationParams) => {
  const { email, name, position } = params

  await sendEmail(email, `Your application for ${position} at ${siteConfig.name}`, <ApplicationEmail name={name} position={position} />)
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
