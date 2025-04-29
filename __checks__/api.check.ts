import { ApiCheck, AssertionBuilder } from 'checkly/constructs'

new ApiCheck('books-api-check-1', {
  name: 'Books API',
  alertChannels: [],
  degradedResponseTime: 10000,
  maxResponseTime: 20000,
  request: {
    url: process.env.ENVIRONMENT_URL! + '/api',
    method: 'GET',
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$[0].api').isNotNull(),
    ],
  },
  runParallel: true,
})
