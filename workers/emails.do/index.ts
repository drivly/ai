export default {
  async email(message, env, ctx) {
    try {
      const from = message.from
      const to = message.to
      const subject = message.headers.get('subject') || ''
      const date = message.headers.get('date') || new Date().toISOString()

      const rawEmail = await message.raw()

      const emailData = {
        from,
        to,
        subject,
        date,
        headers: Object.fromEntries(message.headers.entries()),
        rawContent: rawEmail,
      }

      const response = await fetch('https://apis.do/webhooks/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      console.log('Email forwarded to webhook:', {
        from,
        to,
        subject,
        status: response.status,
      })

      return response.ok
    } catch (error) {
      console.error('Error processing email:', error)
      return false
    }
  },
}
