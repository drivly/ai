import { codeExample } from './code-example'

export const heroContent = {
  badge: 'AI without Complexity',
  title: (
    <>
      Build, Run, and Evaluate
      <br className='hidden md:block' /> AI-Powered Tools Effortlessly.
    </>
  ),
  description: (
    <>
      Effortlessly build, run, and evaluate AI agents with llm.do's plugins for routing,
      <br className='hidden md:block' /> model selection, and API integration.
    </>
  ),
  buttonText: 'Get Started',
  codeExample: codeExample,
} as const
