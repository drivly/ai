import { NextResponse } from 'next/server'
import { API } from '../../../../lib/api'

export const POST = API(async (req, { payload }) => {
  try {
    const { email, domain } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    const existingSubmissions = await payload.find({
      collection: 'waitlist',
      where: {
        and: [{ email: { equals: email } }, { domain: { equals: domain } }],
      },
    })

    if (existingSubmissions.docs.length > 0) {
      return NextResponse.json({ message: 'Email already registered for this waitlist' })
    }

    const waitlistEntry = await payload.create({
      collection: 'waitlist',
      data: {
        email,
        domain,
        status: 'pending',
      },
    })

    return NextResponse.json({
      message: 'Successfully joined waitlist',
      id: waitlistEntry.id,
    })
  } catch (error) {
    console.error('Error in waitlist API:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
})
