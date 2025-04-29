import React from 'react'
import { siteConfig } from '@/components/site-config'
import { Button } from '@/components/ui/button'
import { Body, Container, Head, Hr, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

const currentYear = new Date().getFullYear()

export const WelcomeEmail = ({ name }: { name: string }) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-gray-100 py-[40px] font-sans' style={{ fontFamily: '"IBM Plex Sans", Helvetica, Arial, sans-serif' }}>
        <Preview>👋 You're on the waitlist!</Preview>

        <Container className='mx-auto rounded-lg bg-white p-[32px] shadow-sm'>
          {/* Email body */}
          <Section>
            <Text className='mb-[24px] text-lg text-gray-700'>Hey {name},</Text>
            <Text className='mb-[24px] text-lg text-gray-700'>
              Thanks for signing up for the <strong>.do</strong> waitlist!
            </Text>

            <Text className='mb-[24px] text-lg text-gray-700'>
              We're excited about your interest and can't wait to show you what we're building—a platform to build autonomous enterprises through Business-as-Code.
            </Text>

            <Text className='mb-[24px] text-lg text-gray-700'>
              We're kicking off our first wave of access for companies primed to benefit right away—just reply and tell us about your business and which AI-powered services you'd
              like to build.
            </Text>
          </Section>

          {/* Signature */}
          <Section className='mt-[32px]'>
            <Text className='mb-[8px] text-lg text-gray-700'>Talk soon,</Text>
            <Text className='text-lg text-gray-700'>Bryant</Text>
            <Text className='text-lg text-gray-700'>Co-Founder & CEO</Text>
          </Section>

          <Hr className='my-[40px] border-gray-200' />

          {/* Social links */}
          <Section className='mt-[32px] text-center'>
            <Text className='mb-[24px] text-blue-600'>
              <Link href={siteConfig.url} className='text-blue-600 no-underline'>
                Dotdo.ai
              </Link>
              {' | '}
              <Link href={siteConfig.baseLinks.github} className='text-blue-600 no-underline'>
                Github
              </Link>
              {' | '}
              <Link href={siteConfig.baseLinks.discord} className='text-blue-600 no-underline'>
                Discord
              </Link>
              {' | '}
              <Link href={siteConfig.baseLinks.twitter} className='text-blue-600 no-underline'>
                X
              </Link>
            </Text>
          </Section>

          <Section>
            <Text className='m-0 mb-[6px] text-center text-xs text-gray-500'>© {currentYear} .do, Inc. All rights reserved.</Text>
            <Text className='m-0 text-center text-xs text-gray-500'>
              <Link href='https://dotdo.ai/unsubscribe' className='text-gray-500 underline'>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default WelcomeEmail
