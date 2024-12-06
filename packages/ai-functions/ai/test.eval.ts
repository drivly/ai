import { createScorer, evalite } from 'evalite'

const containsParis = createScorer<string, string>('Contains Paris', ({ output }) => {
  return output.includes('Paris') ? 1 : 0
})

evalite('My Eval', {
  data: async () => {
    return [{ input: 'Hello', output: 'Hello World!' }]
  },
  task: async (input: string) => {
    return input + ' World!'
  },
  scorers: [containsParis],
})
