'use client'

import { siteConfig } from '@/components/site-config'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RiCheckLine, RiCloudLine, RiDiscordFill, RiInformationLine, RiLightbulbLine, RiSubtractLine, RiUserLine } from '@remixicon/react'
import Link from 'next/link'
import React, { Fragment } from 'react'

type FixedPrice = string

interface VariablePrice {
  monthly: string
  annually: string
}

interface Plan {
  name: string
  price: FixedPrice | VariablePrice
  description: string
  capacity: string[]
  features: string[]
  isStarter: boolean
  isRecommended: boolean
  buttonText: string
  buttonLink: string
}

const plans: Plan[] = [
  {
    name: 'Pay as you Go',
    price: {
      monthly: '$0',
      annually: '$0',
    },
    description: 'Perfect for individuals and small projects with flexible usage needs.',
    capacity: ['No monthly commitment', 'Usage-based billing'],
    features: ['Pay only for what you use', 'Basic API access', 'Community support', 'Standard models', '14-day free trial'],
    isStarter: true,
    isRecommended: false,
    buttonText: 'Get started',
    buttonLink: '#',
  },
  {
    name: 'Scale',
    price: {
      monthly: '$500',
      annually: '$400',
    },
    description: 'For professionals and teams building production-ready AI applications.',
    capacity: ['Fixed monthly fee', 'Usage-based billing'],
    features: ['All Pay as you Go features', 'Priority API access', 'Email & chat support', 'Advanced models', 'Custom prompts', 'Webhooks integration'],
    isStarter: false,
    isRecommended: true,
    buttonText: 'Start 14-day trial',
    buttonLink: '#',
  },
  {
    name: 'Enterprise',
    price: {
      monthly: '$500',
      annually: '$400',
    },
    description: 'For organizations requiring advanced features, security, and dedicated support.',
    capacity: ['Fixed monthly fee', 'Usage-based billing'],
    features: ['All Scale features', 'Dedicated databases', 'Self-hosted databases', 'SAML', 'Directory sync', 'Audit logs', 'SOC2 & HIPAA compliance*'],
    isStarter: false,
    isRecommended: false,
    buttonText: 'Contact sales',
    buttonLink: 'mailto:sales@dotdo.ai',
  },
]

interface Feature {
  name: string
  plans: Record<string, boolean | string>
  tooltip?: string
}

interface Section {
  name: string
  features: Feature[]
}

const sections: Section[] = [
  {
    name: 'Core Features',
    features: [
      {
        name: 'Monthly fee',
        tooltip: 'Fixed monthly subscription cost based on plan',
        plans: { 'Pay as you Go': '$0', Scale: '$500', Enterprise: 'Varies' },
      },
      {
        name: 'Usage-based billing',
        tooltip: 'Pay per token/API call',
        plans: { 'Pay as you Go': 'Yes', Scale: 'Yes', Enterprise: 'Yes' },
      },
      {
        name: 'API access',
        tooltip: 'Programmatic access to .do capabilities',
        plans: { 'Pay as you Go': 'Basic', Scale: 'Limited', Enterprise: 'Full access' },
      },
    ],
  },
  {
    name: 'Model Access',
    features: [
      {
        name: 'Standard models',
        tooltip: 'Access to foundational LLM models',
        plans: { 'Pay as you Go': true, Scale: true, Enterprise: true },
      },
      {
        name: 'Advanced models',
        tooltip: 'Access to more powerful and specialized models',
        plans: { 'Pay as you Go': false, Scale: true, Enterprise: true },
      },
      {
        name: 'Custom fine-tuning',
        tooltip: 'Train models on your own data',
        plans: { 'Pay as you Go': false, Scale: 'Limited', Enterprise: 'Full access' },
      },
    ],
  },
  {
    name: 'Infrastructure',
    features: [
      {
        name: 'Dedicated databases',
        tooltip: 'Isolated database instances for your workloads',
        plans: { 'Pay as you Go': false, Scale: true, Enterprise: true },
      },
      {
        name: 'Self-hosted databases',
        tooltip: 'Run databases in your own infrastructure',
        plans: { 'Pay as you Go': false, Scale: true, Enterprise: true },
      },
      {
        name: 'SAML',
        tooltip: 'Secure single sign-on using SAML',
        plans: { 'Pay as you Go': false, Scale: false, Enterprise: true },
      },
      {
        name: 'Directory sync',
        tooltip: 'Automatically sync user directories',
        plans: { 'Pay as you Go': false, Scale: false, Enterprise: true },
      },
      {
        name: 'Audit logs',
        tooltip: 'Detailed logs for security and compliance.',
        plans: { 'Pay as you Go': false, Scale: false, Enterprise: true },
      },
    ],
  },
  {
    name: 'Support & Compliance',
    features: [
      {
        name: 'Support channels',
        plans: {
          'Pay as you Go': 'Community',
          Scale: 'Email & chat',
          Enterprise: 'Dedicated support',
        },
      },
      {
        name: 'Response time',
        plans: { 'Pay as you Go': 'Best effort', Scale: '24 hours', Enterprise: '4 hours' },
      },
      {
        name: 'SOC2 compliance',
        tooltip: 'Security and availability certification',
        plans: { 'Pay as you Go': false, Scale: 'Coming soon*', Enterprise: 'Coming soon*' },
      },
      {
        name: 'HIPAA compliance',
        tooltip: 'Healthcare data protection standards',
        plans: { 'Pay as you Go': false, Scale: 'Coming soon*', Enterprise: 'Coming soon*' },
      },
    ],
  },
]

const isVariablePrice = (price: FixedPrice | VariablePrice): price is VariablePrice => {
  return (price as VariablePrice).monthly !== undefined
}

export function Pricing() {
  const [billingFrequency, setBillingFrequency] = React.useState<'monthly' | 'annually'>('monthly')
  return (
    <div className='px-3 py-8 sm:py-10 xl:px-0'>
      <section
        aria-labelledby='pricing-title'
        className='animate-slide-up-fade flex flex-col items-center text-center'
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards',
        }}>
        <div className='mb-6 max-w-3xl'>
          <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl leading-none font-medium tracking-tight text-balance text-transparent sm:text-7xl dark:from-white dark:to-white/40'>
            Flexible, Transparent Pricing.
          </h1>
          <p className='mx-auto max-w-xl text-base text-gray-400'>Choose the plan that's right for you. Designed to grow with your needs—pay only for what you use.</p>
        </div>
      </section>
      <section
        id='pricing-overview'
        className='animate-slide-up-fade mt-16'
        aria-labelledby='pricing-overview'
        style={{
          animationDuration: '600ms',
          animationDelay: '200ms',
          animationFillMode: 'backwards',
        }}>
        <div className='flex items-center justify-center gap-2'>
          <Label htmlFor='billing-switch' className='text-base font-medium text-gray-400 sm:text-sm'>
            Monthly
          </Label>
          <Switch
            id='billing-switch'
            checked={billingFrequency === 'annually'}
            onCheckedChange={() => setBillingFrequency(billingFrequency === 'monthly' ? 'annually' : 'monthly')}
          />
          <Label htmlFor='billing-switch' className='text-base font-medium text-gray-400 sm:text-sm'>
            Yearly (Save 20%)
          </Label>
        </div>
        <div className='mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3'>
          {plans.map((plan, planIdx) => (
            <div key={planIdx} className='relative'>
              {plan.isRecommended ? (
                <div className='absolute inset-x-0 -top-3 flex justify-center'>
                  <span className='font-base z-10 inline-flex items-center rounded-full bg-gray-600 px-3 py-1 text-sm text-gray-200 ring-1 ring-gray-700/40 ring-inset'>
                    Most Popular
                  </span>
                </div>
              ) : null}
              <div
                className={cn(
                  'h-full rounded-lg border bg-slate-600/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] shadow-md transition-all',
                  plan.isRecommended ? 'border-gray-700 ring-white/10' : 'border-gray-800',
                  'relative p-6',
                  'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
                )}>
                <div className='flex h-full flex-col justify-between'>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{plan.name}</h2>
                    <div className='mt-3 flex items-baseline gap-x-2'>
                      {plan.name === 'Enterprise' ? (
                        <span className='inline-block py-2 align-bottom text-sm text-gray-400'>Contact for pricing</span>
                      ) : (
                        <>
                          <span className='text-4xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                            {isVariablePrice(plan.price) ? (billingFrequency === 'monthly' ? plan.price.monthly : plan.price.annually) : plan.price}
                          </span>
                          <span className='text-sm text-gray-400'>
                            /month
                            {billingFrequency === 'annually' && isVariablePrice(plan.price) && plan.price.annually !== '$0' ? ' (billed annually)' : ''}
                          </span>
                        </>
                      )}
                    </div>
                    <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>{plan.description}</p>

                    <ul className='mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400'>
                      {plan.capacity.map((feature, index) => (
                        <li key={feature} className='flex items-center gap-x-3'>
                          {index === 0 && <RiUserLine className='size-4 shrink-0 text-gray-500' aria-hidden='true' />}
                          {index === 1 && <RiCloudLine className='size-4 shrink-0 text-gray-500' aria-hidden='true' />}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className='mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400'>
                      {plan.features.map((feature) => (
                        <li key={feature} className='flex items-center gap-x-3'>
                          <RiCheckLine className='size-4 shrink-0 text-emerald-400' aria-hidden='true' />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='mt-8'>
                    {plan.isStarter ? (
                      <Button variant='outline' asChild className='group h-10 w-full rounded-sm'>
                        <Link href={plan.buttonLink} className='flex items-center justify-center'>
                          {plan.buttonText}
                          <span className='ml-2 transition-transform group-hover:translate-x-1'>→</span>
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className='group h-10 w-full rounded-sm bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200'>
                        <Link href={plan.buttonLink} className='flex items-center justify-center'>
                          {plan.buttonText}
                          <span className='ml-2 transition-transform group-hover:translate-x-1'>→</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footnote */}
      <div className='font-base mt-4 px-4 py-2 text-center text-sm text-gray-500 sm:mt-8'>
        *All plans include consumption-based charges (per token/API call) in addition to the monthly fee
      </div>

      {/* plan details */}
      <section id='pricing-details-mobile' className='mt-20 lg:mt-3' aria-labelledby='pricing-details-mobile'>
        <div className='mx-auto space-y-12 lg:hidden lg:max-w-md'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Compare plans</h2>
          {plans.map((plan) => (
            <div key={plan.name}>
              <div className='rounded-lg bg-slate-600/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-6 ring-1 ring-gray-200 ring-inset dark:ring-gray-800'>
                <h3 id={plan.name} className='text-base leading-6 font-semibold text-gray-900 dark:text-white'>
                  {plan.name}
                </h3>
                <p className='text-sm font-normal text-gray-600 dark:text-gray-400'>
                  {plan.name === 'Enterprise'
                    ? 'Contact sales'
                    : isVariablePrice(plan.price)
                      ? `${
                          billingFrequency === 'monthly' ? plan.price.monthly : plan.price.annually
                        } / month${billingFrequency === 'annually' && plan.price.annually !== '$0' ? ' (billed annually)' : ''}`
                      : `${plan.price} /month`}
                </p>
              </div>
              <ul role='list' className='mt-8 space-y-8 text-sm leading-6 text-gray-900 dark:text-white'>
                {sections.map((section) => (
                  <li key={section.name}>
                    <h4 className='font-semibold'>{section.name}</h4>
                    <ul role='list' className='mt-2 divide-y divide-gray-200 dark:divide-gray-800'>
                      {section.features.map((feature) =>
                        feature.plans[plan.name] !== undefined ? (
                          <li key={feature.name} className='flex gap-x-3 py-3'>
                            {feature.plans[plan.name] === true ? (
                              <RiCheckLine className='size-5 flex-none text-emerald-400' aria-hidden='true' />
                            ) : feature.plans[plan.name] === false ? (
                              <RiSubtractLine className='size-5 flex-none text-gray-400 dark:text-gray-600' aria-hidden='true' />
                            ) : (
                              <RiLightbulbLine className='size-5 flex-none text-gray-600 dark:text-gray-400' aria-hidden='true' />
                            )}
                            <span>
                              {feature.name}{' '}
                              {typeof feature.plans[plan.name] === 'string' ? (
                                <span className='text-sm leading-6 text-gray-500 dark:text-gray-400'>({feature.plans[plan.name]})</span>
                              ) : null}
                            </span>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* plan details (lg+) */}
      <section id='pricing-details-desktop' className='mx-auto mt-4 md:mt-3' aria-labelledby='pricing-details-desktop'>
        <div className='hidden lg:block'>
          <div className='relative'>
            <div className='sticky top-0 z-20 h-20 w-full bg-white dark:bg-black' />
            <table className='w-full table-fixed border-separate border-spacing-0 text-left'>
              <caption className='sr-only'>Pricing plan comparison</caption>
              <colgroup>
                <col className='w-2/5' />
                <col className='w-1/5' />
                <col className='w-1/5' />
                <col className='w-1/5' />
              </colgroup>
              <thead className='sticky top-20'>
                <tr>
                  <th scope='col' className='border-b border-gray-200 bg-white pb-8 dark:border-gray-800 dark:bg-black'>
                    <div className='leading-7 font-semibold text-gray-900 dark:text-white'>Compare plans</div>
                    <div className='text-sm font-normal text-gray-600 dark:text-gray-400'>
                      {billingFrequency === 'annually' ? 'Price per month (billed yearly)' : 'Price per month'}
                    </div>
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.name} scope='col' className='border-b border-gray-200 bg-white px-6 pb-8 lg:px-8 dark:border-gray-800 dark:bg-black'>
                      <div className={cn(plan.isRecommended ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white', 'leading-7 font-semibold')}>
                        {plan.name}
                        {plan.isRecommended && (
                          <span className='ml-2 inline-flex items-center rounded-full bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-300 ring-inset dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700/40'>
                            Popular
                          </span>
                        )}
                      </div>
                      <div className='text-sm font-normal text-gray-600 dark:text-gray-400'>
                        {plan.name === 'Enterprise'
                          ? 'Contact sales'
                          : isVariablePrice(plan.price)
                            ? `${billingFrequency === 'monthly' ? plan.price.monthly : plan.price.annually} / month`
                            : `${plan.price} /month`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((section, sectionIdx) => (
                  <Fragment key={section.name}>
                    <tr>
                      <th
                        scope='colgroup'
                        colSpan={4}
                        className={cn(
                          sectionIdx === 0 ? 'pt-14' : 'pt-10',
                          'border-b border-gray-200 pb-4 text-base leading-6 font-semibold text-gray-900 dark:border-gray-800 dark:text-white',
                        )}>
                        {section.name}
                      </th>
                    </tr>
                    {section.features.map((feature) => (
                      <tr key={feature.name} className='transition hover:bg-slate-800/20'>
                        <th
                          scope='row'
                          className='flex items-center gap-2 border-b border-gray-100 py-4 text-sm leading-6 font-normal text-gray-900 dark:border-gray-800 dark:text-white'>
                          <span>{feature.name}</span>
                          {feature.tooltip ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <RiInformationLine className='size-4 shrink-0 cursor-pointer text-gray-400' aria-hidden='true' />
                                </TooltipTrigger>
                                <TooltipContent side='right' className='border !border-gray-800'>
                                  {feature.tooltip}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : null}
                        </th>
                        {plans.map((plan) => (
                          <td key={plan.name} className='border-b border-gray-200 px-6 py-4 lg:px-8 dark:border-gray-800'>
                            {typeof feature.plans[plan.name] === 'string' ? (
                              <div className='text-sm leading-6 text-gray-600 dark:text-gray-400'>{feature.plans[plan.name]}</div>
                            ) : (
                              <>
                                {feature.plans[plan.name] === true ? (
                                  <RiCheckLine className='h-5 w-5 text-emerald-400' aria-hidden='true' />
                                ) : (
                                  <RiSubtractLine className='h-5 w-5 text-gray-400 dark:text-gray-600' aria-hidden='true' />
                                )}

                                <span className='sr-only'>
                                  {feature.plans[plan.name] === true ? 'Included' : 'Not included'} in {plan.name}
                                </span>
                              </>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
                <tr>
                  <th scope='row' className='pt-6 text-sm leading-6 font-normal text-gray-900 dark:text-white'>
                    <span className='sr-only'>Link to activate plan</span>
                  </th>
                  {plans.map((plan) => (
                    <td key={plan.name} className='px-6 pt-6 lg:px-8'>
                      <Button
                        variant={plan.isStarter ? 'outline' : 'default'}
                        asChild
                        className={cn(
                          'group h-10 rounded-sm',
                          !plan.isStarter && 'h-10 rounded-sm bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200',
                        )}>
                        <Link href={plan.buttonLink} className='flex items-center justify-center'>
                          {plan.buttonText}
                          <span className='ml-2 transition-transform group-hover:translate-x-1'>→</span>
                        </Link>
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Join Discord Community */}
      <section className='my-20 overflow-hidden rounded-lg border border-gray-800 sm:my-36'>
        <div className='relative grid grid-cols-1 bg-slate-600/25 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-6 md:p-12 lg:grid-cols-2'>
          {/* Discord splash icon */}
          <div className='pointer-events-none absolute -right-16 -bottom-24 opacity-[0.04]'>
            <RiDiscordFill className='h-80 w-80 text-white' />
          </div>
          <div className='relative z-10'>
            <h2 className='text-2xl font-semibold text-gray-900 md:text-3xl dark:text-white'>Join the Community</h2>
            <p className='mt-4 text-gray-400'>
              Join our Discord to collaborate with visionary developers, business leaders, and AI enthusiasts transforming business processes into code.
            </p>
          </div>

          <div className='relative z-10 text-right lg:mx-12'>
            <div className='mt-8 space-y-4'>
              <Button asChild className='h-10 w-full rounded-sm bg-[#7289da] text-black hover:bg-[#839AED] lg:w-1/2'>
                <Link href={siteConfig.baseLinks.discord} className='flex items-center justify-center'>
                  <RiDiscordFill className='mr-2 size-5' />
                  Join Discord
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
