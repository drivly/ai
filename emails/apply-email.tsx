import React from 'react'
import { siteConfig } from '@/components/site-config'
import { Button } from '@/components/ui/button'
import { Body, Container, Head, Hr, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

const currentYear = new Date().getFullYear()

export const ApplyEmail = ({ name }: { name: string }) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-gray-100 py-[40px] font-sans' style={{ fontFamily: '"IBM Plex Sans", Helvetica, Arial, sans-serif' }}>
        <Preview>👋 Thanks for applying!</Preview>

        <Container className='mx-auto rounded-lg bg-white p-[32px] shadow-sm'>
          {/* Email body */}
          <Section>
            <Text className='mb-[24px] text-lg text-gray-700'>Hey {name},</Text>
            <Text className='mb-[24px] text-lg text-gray-700'>Thank you for your interest in joining our team!</Text>

            <Text className='mb-[24px] text-lg text-gray-700'>
              We're looking for people who are passionate about building, supporting, and scaling the future of AI-driven work.
            </Text>

            <Text className='mb-[24px] text-lg text-gray-700'>
              We review GitHub profiles and projects closely, so if there's anything else you'd like to highlight — side projects, content, community work — feel free to send it
              over.
            </Text>

            <Text className='mb-[24px] text-lg text-gray-700'>If it feels like a fit, we'll be in touch to set up a conversation.</Text>
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

export default ApplyEmail
