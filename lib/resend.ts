import 'server-only'

import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY || (process.env.NODE_ENV === 'test' ? 'test_mock_key' : undefined)
const resend = new Resend(apiKey)

export default resend
