import Link from 'next/link'

const dotdoLinks = ['workflows.do', 'functions.do', 'agents.do', 'llm.do', 'apis.do']

export function DotdoLinkSection() {
  return (
    <section id='dotdo' className='mx-auto my-16 max-w-[80rem] px-3 text-center md:my-32 md:px-8'>
      <div className='py-16'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <h2 className='text-center text-sm font-semibold text-gray-600 uppercase'>Deliver economically valuable work</h2>
          <div className='mt-6'>
            <ul className='flex flex-wrap items-center justify-center gap-x-10 gap-y-10 md:gap-x-16'>
              <li>
                <Link
                  href='https://workflows.do'
                  className='hover:text-primary text-xl font-medium text-gray-400 transition-colors sm:text-lg font-ibm'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Workflows.do
                </Link>
              </li>
              <li>
                <Link
                  href='https://functions.do'
                  className='hover:text-primary text-xl font-medium text-gray-400 transition-colors sm:text-lg font-ibm'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Functions.do
                </Link>
              </li>
              <li>
                <Link
                  href='https://agents.do'
                  className='hover:text-primary text-xl font-medium text-gray-400 transition-colors sm:text-lg font-ibm'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Agents.do
                </Link>
              </li>
              <li>
                <Link
                  href='https://llm.do'
                  className='hover:text-primary text-xl font-medium text-gray-400 transition-colors sm:text-lg font-ibm'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  LLM.do
                </Link>
              </li>
              <li>
                <Link
                  href='https://apis.do'
                  className='hover:text-primary text-xl font-medium text-gray-400 transition-colors sm:text-lg font-ibm'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  APIs.do
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
