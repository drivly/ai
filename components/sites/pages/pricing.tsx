'use client'

import { Faqs } from '@/components/sites/sections/faqs'
import { Button } from '@drivly/ui/button'
import { Label } from '@drivly/ui/label'
import { cn } from '@drivly/ui/lib'
import { Switch } from '@drivly/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@drivly/ui/tooltip'
import { RiCheckLine, RiCloudLine, RiInformationLine, RiLightbulbLine, RiSubtractLine, RiUserLine } from '@remixicon/react'
import Link from 'next/link'
import React, { Fragment } from 'react'

import { Enterprise } from '../sections/enterprise'

type FixedPrice = string

interface VariablePrice {
  monthly: string
  annually: string
}

export const plans = [
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
    name: 'Build',
    price: {
      monthly: '$50',
      annually: '$40',
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
    name: 'Scale',
    price: {
      monthly: '$500',
      annually: '$400',
    },
    description: 'For organizations requiring advanced features, security, and dedicated support.',
    capacity: ['Fixed monthly fee', 'Usage-based billing'],
    features: ['All Build features', 'Dedicated databases', 'Self-hosted databases', 'WorkOS integrations', 'Audit logs, SAML, directory sync', 'SOC2 & HIPAA compliance*'],
    isStarter: false,
    isRecommended: false,
    buttonText: 'Start 14-day trial',
    buttonLink: '#',
  },
] as const

export const pricingSections = [
  {
    name: 'Core Features',
    features: [
      {
        name: 'Monthly fee',
        tooltip: 'Fixed monthly subscription cost',
        plans: { 'Pay as you Go': '$0', Build: '$50', Scale: '$500' },
      },
      {
        name: 'Usage-based billing',
        tooltip: 'Pay per token or API call',
        plans: { 'Pay as you Go': 'Yes', Build: 'Yes', Scale: 'Yes' },
      },
      {
        name: 'Free trial',
        tooltip: 'Try before you commit',
        plans: { 'Pay as you Go': '14 days', Build: '14 days', Scale: '14 days' },
      },
      {
        name: 'API access',
        tooltip: 'Programmatic access to LLM.do capabilities',
        plans: { 'Pay as you Go': 'Basic', Build: 'Priority', Scale: 'Priority+' },
      },
    ],
  },
  {
    name: 'Model Access',
    features: [
      {
        name: 'Standard models',
        tooltip: 'Access to foundational LLM models',
        plans: { 'Pay as you Go': true, Build: true, Scale: true },
      },
      {
        name: 'Advanced models',
        tooltip: 'Access to more powerful and specialized models',
        plans: { 'Pay as you Go': false, Build: true, Scale: true },
      },
      {
        name: 'Custom fine-tuning',
        tooltip: 'Train models on your own data',
        plans: { 'Pay as you Go': false, Build: 'Limited', Scale: 'Full access' },
      },
    ],
  },
  {
    name: 'Infrastructure',
    features: [
      {
        name: 'Dedicated databases',
        tooltip: 'Isolated database instances for your workloads',
        plans: { 'Pay as you Go': false, Build: false, Scale: true },
      },
      {
        name: 'Self-hosted databases',
        tooltip: 'Run databases in your own infrastructure',
        plans: { 'Pay as you Go': false, Build: false, Scale: true },
      },
      {
        name: 'WorkOS integrations',
        tooltip: 'Enterprise-grade authentication and directory services',
        plans: { 'Pay as you Go': false, Build: false, Scale: true },
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
          Build: 'Email & chat',
          Scale: 'Dedicated support',
        },
      },
      {
        name: 'Response time',
        plans: { 'Pay as you Go': 'Best effort', Build: '24 hours', Scale: '4 hours' },
      },
      {
        name: 'SOC2 compliance',
        tooltip: 'Security and availability certification',
        plans: { 'Pay as you Go': false, Build: false, Scale: 'Coming soon*' },
      },
      {
        name: 'HIPAA compliance',
        tooltip: 'Healthcare data protection standards',
        plans: { 'Pay as you Go': false, Build: false, Scale: 'Coming soon*' },
      },
    ],
  },
] as const

const isVariablePrice = (price: FixedPrice | VariablePrice): price is VariablePrice => {
  return (price as VariablePrice).monthly !== undefined
}

export function Pricing() {
  const [billingFrequency, setBillingFrequency] = React.useState<'monthly' | 'annually'>('monthly')

  return (
    <div className='py-8 sm:py-12'>
      <section
        aria-labelledby='pricing-title'
        className='animate-slide-up-fade flex flex-col items-center text-center'
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards',
        }}>
        <div className='mt-2 max-w-3xl'>
          <h1 className='text-center text-4xl font-semibold text-white sm:text-5xl'>Transparent and scalable pricing.</h1>
          <p className='text-md mt-6 max-w-2xl text-gray-400'>Choose the plan that's right for you. All plans include a 14-day free trial, you only pay for what you use.</p>
        </div>
      </section>
      <section
        id='pricing-overview'
        className='animate-slide-up-fade container mx-auto mt-16 max-w-5xl'
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
                  <span className='font-base z-10 inline-flex items-center rounded-full bg-gray-600 px-3 py-1 text-sm text-gray-200 ring-1 ring-gray-300 ring-gray-700/40 ring-inset'>
                    Most Popular
                  </span>
                </div>
              ) : null}
              <div
                className={cn(
                  'h-full rounded-lg border bg-slate-600/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] shadow-md transition-all',
                  plan.isRecommended ? 'border-gray-300 border-gray-700 ring-white/10' : 'border-gray-800',
                  'relative p-6',
                  'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
                )}>
                <div className='flex h-full flex-col justify-between'>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{plan.name}</h2>
                    <div className='mt-3 flex items-baseline gap-x-2'>
                      <span className='text-4xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                        {isVariablePrice(plan.price) ? (billingFrequency === 'monthly' ? plan.price.monthly : plan.price.annually) : plan.price}
                      </span>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        /month
                        {billingFrequency === 'annually' && isVariablePrice(plan.price) && plan.price.annually !== '$0' ? ' (billed annually)' : ''}
                      </span>
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
                      <Button variant='outline' asChild className='group w-full'>
                        <Link href={plan.buttonLink} className='flex items-center justify-center'>
                          {plan.buttonText}
                          <span className='ml-2 transition-transform group-hover:translate-x-1'>→</span>
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className='group w-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200'>
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
                  {isVariablePrice(plan.price)
                    ? `${
                        billingFrequency === 'monthly' ? plan.price.monthly : plan.price.annually
                      } / month${billingFrequency === 'annually' && plan.price.annually !== '$0' ? ' (billed annually)' : ''}`
                    : `${plan.price} /month`}
                </p>
              </div>
              <ul role='list' className='mt-8 space-y-8 text-sm leading-6 text-gray-900 dark:text-white'>
                {pricingSections.map((section) => (
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
      <section id='pricing-details-desktop' className='container mx-auto mt-4 max-w-5xl md:mt-3' aria-labelledby='pricing-details-desktop'>
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
                        {isVariablePrice(plan.price) ? `${billingFrequency === 'monthly' ? plan.price.monthly : plan.price.annually} / month` : `${plan.price} /month`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingSections.map((section, sectionIdx) => (
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
                          className='flex items-center gap-2 border-b border-gray-200 py-4 text-sm leading-6 font-normal text-gray-900 dark:border-gray-800 dark:text-white'>
                          <span>{feature.name}</span>
                          {'tooltip' in feature ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <RiInformationLine className='size-4 shrink-0 cursor-help text-gray-400' aria-hidden='true' />
                                </TooltipTrigger>
                                <TooltipContent side='right'>{feature.tooltip}</TooltipContent>
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
                        className={cn('group', !plan.isStarter && 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200')}>
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
      <Enterprise />
      <Faqs />
    </div>
  )
}


