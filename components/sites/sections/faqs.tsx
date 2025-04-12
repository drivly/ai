import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@drivly/ui/accordion'
import { sites } from '@/.velite'

const defaultFaqs = [
  {
    question: "Does implementing `.do` require significant upfront developer effort or major infrastructure changes?",
    answer:
      "**Minimal friction.** .do integrates smoothly with your existing tech stack and development processes. With intuitive APIs, SDKs, and composable primitives, your development team can quickly build or extend powerful workflows without major refactoring or infrastructure overhauls. Our CLI and GitHub integrations further streamline implementation.",
  },
  {
    question: "Will `.do` lock us into specific AI models or frameworks, limiting flexibility?",
    answer:
      "**No vendor lock-in.** .do abstracts away model-specific details, letting you focus solely on structured outputs and business outcomes. We continuously evaluate, benchmark, and route your workloads to the optimal models based on your defined priorities—performance, cost-efficiency, or cutting-edge capabilities—ensuring flexibility and future-proofing your tech stack.",
  },
  {
    question: "Can `.do` reliably handle mission-critical operations at enterprise scale?",
    answer:
      "**Absolutely!** .`do` is built on robust primitives—deterministic Functions, structured Workflows, and autonomous Agents—that ensure reliability, predictability, and scalability. Our customers confidently automate mission-critical processes, backed by our enterprise-grade monitoring, observability, and performance optimization tools.",
  },
  {
    question: "How does `.do` ensure data privacy and security compliance?",
    answer:
      "**Enterprise-grade protection.** Our platform implements end-to-end encryption, role-based access controls, and comprehensive audit logging. We're compliant with SOC 2, GDPR, HIPAA, and other industry standards. All data processing occurs within your designated regions, and we never use your data to train our models—ensuring your intellectual property remains protected.",
  },
  {
    question: "How does `.do` help control costs as our AI usage grows?",
    answer:
      "**Predictable economics.** Our platform provides granular usage monitoring, cost allocation by team/project, and configurable rate limiting. You can set budget caps at multiple levels and receive alerts before thresholds are reached. Our optimization engine automatically selects the most cost-effective models for each task based on your requirements, ensuring transparent and manageable spending.",
  },
]

interface FAQ {
  question: string
  answer: string
}

interface FaqsProps {
  domain?: string
}

export function Faqs({ domain }: FaqsProps) {
  const siteContent = domain ? sites.find((s: any) => {
    const titleDomain = s.title.split(' - ')[0].toLowerCase()
    return domain === titleDomain.toLowerCase() || 
           domain === titleDomain.toLowerCase().replace('.do', '') ||
           s.title.toLowerCase().includes(domain.toLowerCase())
  }) : null
  
  const siteFaqs = siteContent?.faqs
  const faqsToShow = siteFaqs?.length ? siteFaqs : defaultFaqs

  return (
    <section className='container mx-auto max-w-6xl px-3 py-20 sm:my-36' aria-labelledby='faq-title'>
      <div className='grid grid-cols-1 lg:grid-cols-12 lg:gap-14'>
        <div className='col-span-full sm:col-span-5'>
          <h2 id='faq-title' className='scroll-my-24 text-2xl font-semibold tracking-tight text-white lg:text-3xl'>
            Frequently Asked Questions
          </h2>
        </div>
        <div className='col-span-full mt-6 lg:col-span-7 lg:mt-0'>
          <Accordion type='multiple' className='sm:mx-auto'>
            {faqsToShow.map((item: FAQ) => (
              <AccordionItem value={item.question} key={item.question} className='border-b border-gray-800 py-3 first:pt-0 first:pb-3'>
                <AccordionTrigger className='text-left text-lg text-white hover:no-underline'>{item.question}</AccordionTrigger>
                <AccordionContent className='text-base leading-[24px] text-gray-400 sm:text-sm sm:leading-[22px]'>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
