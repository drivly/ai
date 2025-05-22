import { ApiCheck, AssertionBuilder } from 'checkly/constructs'

const origin = process.env.ENVIRONMENT_URL || 'https://ai-git-main.dev.driv.ly'

new ApiCheck('root-api-check-1', {
  name: 'Root API',
  alertChannels: [],
  degradedResponseTime: 10000,
  maxResponseTime: 20000,
  request: {
    url: origin + '/api',
    method: 'GET',
    followRedirects: true,
    skipSSL: false,
    assertions: [AssertionBuilder.statusCode().equals(200), AssertionBuilder.jsonBody('$[0].api').isNotNull()],
  },
  runParallel: true,
})
