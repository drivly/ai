'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@drivly/ui/accordion'
import { useSiteContent } from '@/hooks/use-site-content'

const defaultFaqs = [
  {
    question: "What security guarantees do you provide for my company's data?",
    answer:
      "Our platform employs enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with industry standards. All data is encrypted both in transit and at rest, and we maintain strict access controls to protect your sensitive information.",
  },
  {
    question: "How does your platform scale with increasing workloads?",
    answer:
      "Our infrastructure automatically scales horizontally to handle increased demand, ensuring consistent performance even during peak usage. We've designed our system to handle enterprise-level workloads without performance degradation.",
  },
  {
    question: "What makes your API different from other AI platforms?",
    answer:
      "Unlike other solutions that require extensive setup and maintenance, our platform provides a simple, developer-friendly API that works out of the box. We focus on strong typing and validation to catch errors at build time rather than runtime, significantly reducing production issues.",
  },
  {
    question: "How do you ensure reliability for production applications?",
    answer:
      "We provide a 99.99% uptime SLA for enterprise customers, with redundant infrastructure across multiple regions. Our monitoring systems detect and mitigate issues before they affect your applications.",
  },
  {
    question: "Can we integrate with our existing tools and workflows?",
    answer:
      "Yes, our platform is designed for seamless integration with your current technology stack. We provide SDKs for all major programming languages and pre-built integrations with popular development tools and services.",
  },
]

export function Faqs() {
  const { faqs: siteFaqs } = useSiteContent() || {}
  
  type FaqItem = {
    question: string;
    answer: string;
  };
  
  const faqsToShow = siteFaqs?.length ? siteFaqs : defaultFaqs as FaqItem[]

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
            {faqsToShow.map((item) => (
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
