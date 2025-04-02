import { Button } from '@/pkgs/ui/src/server/components/button'
import { FaGithub } from 'react-icons/fa'
import { CodeWindow } from '@/app/@components/site/code-window'

export default function HeroSection() {
  const codeExample = `{
  "api": {
    "name": "APIs.do",
    "description": "Economically valuable work delivered through simple APIs",
    "with": "[https://agi.do](https://agi.do)"
  },
  "featured": {
    "Functions - Typesafe Results without Complexity": "[https://functions.do](https://functions.do)",
    "Workflows - Reliably Execute Business Processes": "[https://workflows.do](https://workflows.do)",
    "Agents - Deploy & Manage Autonomous Digital Workers": "[https://agents.do](https://agents.do)"
  },
  "events": {
    "Triggers - Initiate workflows based on events": "[https://triggers.do](https://triggers.do)",
    "Searches - Query and retrieve data": "[https://searches.do](https://searches.do)",
    "Actions - Perform tasks within workflows": "[https://actions.do](https://actions.do)"
  },
  "core": {
    "LLM - Intelligent AI Gateway": "[https://llm.do](https://llm.do)",
    "Evals - Evaluate Functions, Workflows, and Agents": "[https://evals.do](https://evals.do)",
    "Analytics - Economically Validate Workflows": "[https://analytics.do](https://analytics.do)",
    "Experiments - Economically Validate Workflows": "[https://experiments.do](https://experiments.do)",
    "Database - AI Native Data Access (Search + CRUD)": "[https://database.do](https://database.do)",
    "Integrations - Connect External APIs and Systems": "[https://integrations.do](https://integrations.do)"
  },
  "user": {}
}`

  return (
    <section id='hero' className='relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8 lg:mt-48'>
      <div className='group inline-flex h-7 items-center justify-between gap-1 rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white backdrop-filter-[12px] transition-all ease-in hover:cursor-pointer hover:bg-white/20 dark:text-black'>
        <p className='mx-auto inline-flex max-w-md items-center justify-center text-neutral-600/50 dark:text-neutral-400/50'>
          <span>AI without Complexity</span>
        </p>
      </div>
      <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl leading-none font-medium tracking-tighter text-balance text-transparent sm:text-7xl dark:from-white dark:to-white/40'>
        Build, Run, and Evaluate
        <br className='hidden md:block' /> AI-Powered Tools Effortlessly.
      </h1>
      <p className='mb-12 text-lg tracking-tight text-balance text-gray-400 md:text-xl'>
        Effortlessly build, run, and evaluate AI agents with llm.do's plugins for routing,
        <br className='hidden md:block' /> model selection, and API integration.
      </p>
      <Button className='gap-2 rounded-lg text-white ease-in-out dark:text-black'>
        <FaGithub className='h-4 w-4' />
        <span>Get Started</span>
      </Button>

      {/* Code window with glow effect */}
      <div className='relative mt-[2rem] -mr-[20%] w-[120%] sm:mt-[4rem] md:mx-auto md:w-auto md:max-w-3xl'>
        {/* Add the green glow effect directly behind the code window */}
        <div
          className='absolute -inset-10 -z-10 opacity-70 blur-2xl'
          style={{
            background: 'radial-gradient(circle at center, #05b2a6, transparent 70%)',
            transform: 'translateY(20px)',
          }}></div>

        <div>
          <CodeWindow code={codeExample} />
        </div>
      </div>
    </section>
  )
}
