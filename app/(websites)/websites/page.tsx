import type { Website } from '@/website.config'
import { websiteKeys } from '@/website.config'
import { notFound } from 'next/navigation'
// import { MDXRemote } from 'next-mdx-remote'
import Markdown from 'react-markdown'
import dedent from 'dedent'
import './styles.css'

// need to be able to render the specific website from the slug and throw not found if the slug is not found
export default async function HomePage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params

  const site = domain as Website

  if (site && !websiteKeys.includes(site)) {
    return notFound()
  }

  return (
    <div className='home'>
      <h1>{domain}</h1>
      <Markdown>
        {dedent`
          # AGI.do | Delivering economically valuable work through Business-as-Code

          ## [Functions.do](https://functions.do) typesafe outputs without complexity

          ## [Workflows.do](https://workflows.do) reliable business processes

          ## [Agents.do](https://agents.do) autonomous digital workers

        `}
      </Markdown>
    </div>
  )
}
