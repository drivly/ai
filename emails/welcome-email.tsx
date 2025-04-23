import { siteConfig } from '@/components/site-config'
import { Body, Container, Head, Hr, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

export const WelcomeEmail = ({ name }: { name: string }) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-gray-100 font-sans'>
        <Preview>Thanks for joining the .Do waitlist! We're excited to have you onboard.</Preview>
        <Container className='mx-auto rounded-lg bg-white p-8 shadow-sm'>
          <Section>
            <Text className='text-lg text-gray-700'>Hey {name},</Text>
            <Text className='text-lg text-gray-700'>
              Thanks for joining the waitlist for .Do — a new kind of AI platform that lets you turn business logic into AI-powered workflows using simple, modular code.
            </Text>

            <Text className='text-lg text-gray-700'>
              We'll reach out soon with early access details. In the meantime, feel free to join our Discord to connect with the community and get a sneak peek at what we're
              building.
            </Text>
          </Section>

          <Hr className='my-8 border-gray-200' />

          {/* Signature */}
          <Section>
            <Text className='text-lg text-gray-700'>Cheers,</Text>
            <Text className='text-lg font-semibold text-gray-700'>Bryant @ .do</Text>
          </Section>

          {/* PS */}
          <Section>
            <Text className='text-base text-gray-700 italic'>
              P.S. If you haven't already, please consider starring us on GitHub. Every ⭐ helps us reach more developers and grow the .Do universe.
            </Text>
          </Section>

          <Section className='text-center'>
            <Text className='text-indigo-600'>
              <Link href={siteConfig.url} className='text-indigo-600 no-underline'>
                Dotdo.ai
              </Link>
              {' | '}
              <Link href={siteConfig.baseLinks.github} className='text-indigo-600 no-underline'>
                Github
              </Link>
              {' | '}
              <Link href={siteConfig.baseLinks.discord} className='text-indigo-600 no-underline'>
                Discord
              </Link>
              {' | '}
              <Link href={siteConfig.baseLinks.twitter} className='text-indigo-600 no-underline'>
                X
              </Link>
            </Text>
          </Section>

          <Section>
            <Text className='text-center text-xs text-gray-500'>© {new Date().getFullYear()} .Do by Drivly, Inc. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default WelcomeEmail
