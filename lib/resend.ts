import 'server-only'

import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY || 'test_mock_key_for_ci_and_tests'
const resend = new Resend(apiKey)

export default resend
