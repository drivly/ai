import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const defaultFAQs = [
  {
    question: 'How secure is the LLM.do platform in terms of protecting sensitive data?',
    answer:
      'LLM.do employs enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with industry standards. All data is encrypted both in transit and at rest, and we maintain strict access controls to protect your sensitive information.',
  },
  {
    question: 'Can I use LLM.do with my existing AI models?',
    answer:
      'Yes, LLM.do is designed to work with a wide range of AI models. Our platform supports integration with popular models from leading providers, and Enterprise customers can also bring their own custom-trained models to the platform.',
  },
  {
    question: 'Does LLM.do support integration with other systems and applications?',
    answer:
      'Absolutely. LLM.do provides comprehensive API access and webhooks that allow for seamless integration with your existing tools and workflows. We offer SDKs for popular programming languages and pre-built integrations with common business applications.',
  },
  {
    question: 'How can I monitor and optimize my usage of the platform?',
    answer:
      'LLM.do includes built-in analytics and monitoring tools that provide insights into your usage patterns, performance metrics, and cost optimization opportunities. Pro and Enterprise plans include more advanced analytics capabilities to help you get the most value from the platform.',
  },
  {
    question: 'What level of technical support is provided with each plan?',
    answer:
      'Free users have access to our community support forums. Pro users receive email and chat support with 24-hour response times. Enterprise customers enjoy dedicated support with 4-hour response times and optional custom training sessions for your team.',
  },
]

export function Faqs({ faqs = defaultFAQs }: { faqs: { question: string; answer: string }[] }) {
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
            {faqs.map((item) => (
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
