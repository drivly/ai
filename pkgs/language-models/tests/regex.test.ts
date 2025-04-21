import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { modelPattern } from '../src'

describe('regex', () => {
  const testCases = [
    'frontier(pdf,cost<1,evals>95)',
    'opensource(reasoning,code,throughput,swebench>50)',
    'gpt-4o(pdf,cost<15)',
    'frontier(thread:1234,json)',
    'gemini(reasoning,slack,discord)',
    'claude-3.7-sonnet@vertex:eu(reasoning:high)',
    'gpt-4o(latency,reasoning)',
    'anthropic/claude-3.7-sonnet@vertex:eu(reasoning:high)',
    'gpt-4o@azure:westus(pdf,cost<20)',
    'gemini-2.5-pro@gcp:asia(code,throughput>500)',
    'gemini(slack,discord.sendMessage)',
    'anthropic(reasoning,github,jira.createTicket)',
    'opensource(reasoning,stripe,twilio.sendSMS)',
    'frontier(JSON,Person)',
    'gpt-4o(JSONArray,Product[])',
    'claude(Text)',
    'anthropic(TextArray)',
    'gemini(Markdown)',
    'opensource(Code:TypeScript,code)',
    'r1(output:{address:string,phoneNumber:number},cost)',
    'frontier(dealReviewBenchmark>75)',
  ]

  const invalidTestCases = ['gemini@test@hello(', 'gemini@test@hello(**)', '**gemini@test@hello(**', 'gpt-4o(test', 'gpt-4o)test(', 'gemini)', '(reasoning)']

  for (const testCase of testCases) {
    it(`should match ${testCase}`, () => {
      expect(modelPattern.test(testCase)).toBe(true)
    })
  }

  for (const testCase of invalidTestCases) {
    it(`should not match ${testCase}`, () => {
      expect(modelPattern.test(testCase)).toBe(false)
    })
  }
})
