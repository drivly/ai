import { API } from '@/lib/api'
import config from '@payload-config'
import { getPayload } from 'payload'
import PostalMime from 'postal-mime'

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  try {
    const rawBody = await request.text()

    let emailData
    try {
      emailData = JSON.parse(rawBody)

      if (emailData.rawContent) {
        const parser = new PostalMime()
        const parsedEmail = await parser.parse(emailData.rawContent)

        emailData = {
          ...emailData,
          parsed: {
            subject: parsedEmail.subject,
            from: parsedEmail.from,
            to: parsedEmail.to,
            cc: parsedEmail.cc,
            bcc: parsedEmail.bcc,
            messageId: parsedEmail.messageId,
            inReplyTo: parsedEmail.inReplyTo,
            references: parsedEmail.references,
            date: parsedEmail.date,
            html: parsedEmail.html,
            text: parsedEmail.text,
            attachments: parsedEmail.attachments?.map((attachment) => ({
              filename: attachment.filename,
              contentType: attachment.mimeType,
              contentId: attachment.contentId,
            })),
          },
        }
      }
    } catch (err) {
      console.error('Error parsing email data:', err)
      return new Response('Invalid email data format', { status: 400 })
    }

    const payloadInstance = await getPayload({ config })
    const results = await payloadInstance.create({
      collection: 'events',
      data: {
        data: emailData,
        type: 'email.received',
        source: 'email',
      },
    })

    console.log('Email processed and stored:', results)
    return { success: true, results }
  } catch (err) {
    console.error('Email processing failed:', err)
    return new Response('Email processing failed', { status: 500 })
  }
})
