import Link from 'next/link'

const dotdoLinks = ['Workflows.do', 'Functions.do', 'Agents.do', 'LLM.do', 'APIs.do']

export function DotdoLinkSection({ title = 'Deliver economically valuable work' }) {
  return (
    <section id='dotdo' className='mx-auto my-16 max-w-[80rem] px-3 text-center md:my-32 md:px-8'>
      <div className='py-16'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <h2 className='text-center text-sm font-semibold text-gray-600 uppercase'>{title}</h2>
          <div className='mt-6'>
            <ul className='flex flex-wrap items-center justify-center gap-x-10 gap-y-10 md:gap-x-16'>
              {dotdoLinks.map((dotdo) => (
                <li key={dotdo}>
                  <Link
                    href={`https://${dotdo.toLowerCase()}`}
                    className='hover:text-primary font-ibm text-xl font-medium text-gray-400 transition-colors sm:text-lg'
                    target='_blank'
                    rel='noopener noreferrer'>
                    {dotdo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
