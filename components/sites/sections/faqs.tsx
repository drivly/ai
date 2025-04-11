'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@drivly/ui/accordion'
import { useSiteContent } from '@/lib/hooks/use-site-content'

const defaultFaqs = [
  {
    question: "How do you ensure data privacy and security compliance?",
    answer:
      "Our platform implements enterprise-grade security with end-to-end encryption and role-based access controls. We're SOC 2, GDPR, and HIPAA compliant, with all data processing occurring in your designated regions. This reduces your compliance burden while ensuring your sensitive data remains protected, addressing a key concern for regulated industries.",
  },
  {
    question: "What's your approach to model reliability and output quality?",
    answer:
      "We implement multiple validation layers that reduce hallucinations by 90% compared to direct API usage. Our platform uses strong typing and schema validation to ensure outputs match your expected format, significantly improving reliability. This translates to fewer production incidents and higher customer satisfaction with AI-powered features.",
  },
  {
    question: "How does your platform handle enterprise-scale workloads?",
    answer:
      "Our infrastructure automatically scales to handle millions of requests per minute with consistent low-latency responses. We maintain 99.99% uptime SLAs with redundancy across multiple regions. This reliability means your business-critical applications won't face downtime or performance degradation, even during peak usage periods.",
  },
  {
    question: "How do we maintain control over costs as usage scales?",
    answer:
      "Our platform provides granular usage monitoring and budget controls that typically reduce AI costs by 40-60%. You can set spending caps at multiple levels and receive alerts before thresholds are reached. Our optimization engine automatically selects the most cost-effective models for each task, ensuring predictable spending even as your AI usage grows.",
  },
  {
    question: "What happens when AI models or providers change?",
    answer:
      "Our abstraction layer shields your business from model changes and provider lock-in. When models update or deprecate, we handle migrations transparently while maintaining backward compatibility. This future-proofs your AI investments and eliminates the risk of sudden disruptions to your applications when the AI landscape evolves.",
  },
]

export function Faqs() {
  const { faqs: siteFaqs } = useSiteContent() || {}
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
