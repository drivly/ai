export function validateEnvironment() {
  const requiredVars = [
    { name: 'RESEND_API_KEY', critical: true },
    { name: 'EMAIL_FROM', critical: true },
    { name: 'AUDIENCE_ID', critical: false },
    { name: 'WAITLIST_DO_SLACK_URL', critical: false },
  ]

  const missing = requiredVars.filter((v) => !process.env[v.name]).map((v) => ({ ...v, value: process.env[v.name] }))

  if (missing.length > 0) {
    const criticalMissing = missing.filter((v) => v.critical)
    if (criticalMissing.length > 0) {
      console.error(
        'Critical environment variables missing:',
        criticalMissing.map((v) => v.name),
      )
      throw new Error('Missing critical environment variables')
    } else {
      console.warn(
        'Non-critical environment variables missing:',
        missing.map((v) => v.name),
      )
    }
  }

  return true
}
