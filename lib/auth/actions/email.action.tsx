'use server'

import { ReactNode } from 'react'

import resend from '@/lib/resend'
import WelcomeEmail from '@/emails/welcome-email'

interface MagicLinkParams {
  email: string
  name: string
  host: string
}

export const sendWelcomeEmail = async (params: MagicLinkParams) => {
  const { email, name, host } = params

  await sendEmail(email, `Welcome to ${host}`, <WelcomeEmail name={name} />)
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
