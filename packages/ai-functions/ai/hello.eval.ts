
import { evalite } from 'evalite'
import { Levenshtein } from 'autoevals'
import hello from './hello.mdx'

console.log(hello)

evalite('My Eval', {
  // A function that returns an array of test data
  // - TODO: Replace with your test data
  data: async () => {
    return [{ input: 'Hello', output: 'Hello World!', expected: 'Hello World!' }]
  },
  // The task to perform
  // - TODO: Replace with your LLM call
  task: async (input) => {
    return input + ' World!'
  },
  // The scoring methods for the eval
  scorers: [Levenshtein],
})