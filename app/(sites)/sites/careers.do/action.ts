'use server'

import { setCookie } from '@/lib/actions/cookie.action'
import { sendApplicationEmail } from '@/lib/auth/actions/email.action'
import { CareerApplicationDetails } from '@/lib/auth/actions/shared-params'
import { sendCareerSlackAlert } from '@/lib/auth/actions/slack.action'
import { authActionClient } from '@/lib/safe-action'
import { revalidatePath } from 'next/cache'
import { CAREERS_DO_APPLIED_COOKIE_NAME, jobPositionSchema } from './schema'
import { EXPIRATION_TIMES } from '@/lib/utils/cookie'

interface GitHubData {
  username?: string
  profileUrl?: string
  bio?: string
  location?: string
  website?: string
  repos?: number
  followers?: number
  following?: number
  createdAt?: string
}

export const githubApplyAction = authActionClient.schema(jobPositionSchema).action(async ({ parsedInput, ctx }) => {
  const { name, email, image } = ctx.user

  if (!name || !email) {
    throw new Error('User name and email are required')
  }

  const githubData = (ctx.user.github || {}) as GitHubData
  const githubProfile = githubData.profileUrl || `https://github.com/${githubData.username}`

  // Prepare application data for Slack with enhanced GitHub info
  const applicationData: CareerApplicationDetails = {
    name,
    email,
    position: parsedInput.position,
    githubProfile,
    avatarUrl: image || undefined,
    bio: githubData.bio || undefined,
    location: githubData.location || undefined,
    followers: githubData.followers || undefined,
    publicRepos: githubData.repos || undefined,
  }

  const slackResult = await sendCareerSlackAlert(applicationData)

  if (!slackResult) {
    console.error('Failed to send Slack notification')
  }

  try {
    await sendApplicationEmail({
      email,
      name: name?.split(' ')[0] || githubData.username || email?.split('@')[0] || '',
      position: parsedInput.position,
    })
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
  }

  // Track application in cookies (server-side)
  await setCookie(CAREERS_DO_APPLIED_COOKIE_NAME.value, parsedInput.position, {
    expiration: EXPIRATION_TIMES.THREE_MONTHS,
  })

  revalidatePath('/')

  // Return success with application data
  return {
    success: true,
    message: 'Application submitted successfully',
    applicationData: {
      position: parsedInput.position,
      applicant: name,
      email,
    },
  }
})
