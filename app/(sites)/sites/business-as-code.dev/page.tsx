import { HeroSection } from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Business-as-Code.dev',
    description: 'Represent your business as clean & simple code to leverage AI for automation, optimization, and scaling business processes',
  }
}

async function BusinessAsCodePage() {
  return (
    <div className='container mx-auto max-w-6xl px-3 py-16'>
      <HeroSection
        title='Business-as-Code'
        description='Represent your business as clean & simple code to leverage AI for automation, optimization, and scaling business processes'
      />

      {/* Content sections from manifesto.mdx */}
      <section className='mt-16'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-medium tracking-tight'>Economically Valuable Work</h2>
            <p className='text-gray-400'>
              Artificial General Intelligence (AGI) is frequently defined as the capability of a system to perform economically valuable work—tasks that deliver tangible and
              measurable impact to businesses, societies, and individuals. Intelligence becomes meaningful when it drives real-world outcomes and measurable value.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-medium tracking-tight'>Moving Beyond Chat</h2>
            <p className='text-gray-400'>
              The first wave of powerful AI brought us conversational models capable of impressive dialogues and generative capabilities. Yet, businesses thrive not just on ideas
              or dialogue, but on decisive, efficient, and scalable actions that tangibly advance strategic objectives.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-16'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-medium tracking-tight'>Functions Without Leaky Abstractions</h2>
            <p className='text-gray-400'>
              To harness AI effectively, we require clean, composable primitives—Functions—that encapsulate logic into clear, repeatable units of work. Functions must be reliable
              and predictable, free from leaky abstractions, with clear inputs and strongly-typed outputs.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-medium tracking-tight'>Workflows for Reliable Business Processes</h2>
            <p className='text-gray-400'>
              Businesses demand structured workflows to integrate AI effectively. Workflows orchestrate Functions—uniting deterministic automation, generative creativity,
              autonomous agentic execution, and human ingenuity—into cohesive systems that deliver reliable outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-16'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-medium tracking-tight'>Agents as Autonomous Digital Workers</h2>
            <p className='text-gray-400'>
              Agents are the autonomous digital workforce of the future—intelligent entities driven by explicit goals and measured rigorously against business-defined Key Results.
              They interact autonomously, invoking Functions, responding to Events, and continuously optimizing through feedback.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-medium tracking-tight'>Business as Code</h2>
            <p className='text-gray-400'>
              The culmination of these primitives—Functions, Workflows, Agents, Evaluations, Experiments, and Observability—is Business as Code. It represents a revolutionary way
              of operating, where businesses encode their operational models directly into structured, observable, and optimizable code.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-16 text-center'>
        <blockquote className='mx-auto max-w-3xl text-xl font-medium text-gray-300 italic'>
          "Business as Code is not just the future of software. It is the future of intelligent work itself."
        </blockquote>
      </section>

      {/* AI Primitives section from index.mdx */}
      <section className='mt-20'>
        <h2 className='mb-8 text-3xl font-medium tracking-tight'>AI Primitives</h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='rounded-lg border border-gray-800 p-6 transition-all hover:border-gray-700'>
            <h3 className='mb-3 text-xl font-medium'>Workflows.do</h3>
            <p className='text-gray-400'>Define business processes as clean & simple code. Orchestrate multiple functions to accomplish complex tasks.</p>
            <Link href='/docs/workflows' className='mt-4 inline-block text-sm font-medium text-blue-500 hover:text-blue-400'>
              Learn more →
            </Link>
          </div>

          <div className='rounded-lg border border-gray-800 p-6 transition-all hover:border-gray-700'>
            <h3 className='mb-3 text-xl font-medium'>Functions.do</h3>
            <p className='text-gray-400'>Strongly-typed AI functions for specific tasks. Execute code, use AI to generate structured data, or assign tasks.</p>
            <Link href='/docs/functions' className='mt-4 inline-block text-sm font-medium text-blue-500 hover:text-blue-400'>
              Learn more →
            </Link>
          </div>

          <div className='rounded-lg border border-gray-800 p-6 transition-all hover:border-gray-700'>
            <h3 className='mb-3 text-xl font-medium'>Agents.do</h3>
            <p className='text-gray-400'>Autonomous digital workers that combine functions and workflows. Driven by explicit goals and measured against Key Results.</p>
            <Link href='/docs/agents' className='mt-4 inline-block text-sm font-medium text-blue-500 hover:text-blue-400'>
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Business section */}
      <section className='mt-20'>
        <h2 className='mb-8 text-3xl font-medium tracking-tight'>Business</h2>
        <p className='mb-8 text-lg text-gray-400'>
          By representing your Business-as-Code, you can leverage the power of AI to automate, optimize, and scale your business processes. Define strategic objectives, measure
          progress with KPIs, and rapidly iterate through experiments.
        </p>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-lg border border-gray-800 p-6 transition-all hover:border-gray-700'>
            <h3 className='mb-3 text-xl font-medium'>Goals.do</h3>
            <p className='text-gray-400'>Strategic business objectives you want to achieve.</p>
          </div>

          <div className='rounded-lg border border-gray-800 p-6 transition-all hover:border-gray-700'>
            <h3 className='mb-3 text-xl font-medium'>KPIs.do</h3>
            <p className='text-gray-400'>Measure progress towards achieving your goals.</p>
          </div>

          <div className='rounded-lg border border-gray-800 p-6 transition-all hover:border-gray-700'>
            <h3 className='mb-3 text-xl font-medium'>Experiments.do</h3>
            <p className='text-gray-400'>Rapidly iterate and improve your business processes.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: BusinessAsCodePage })
