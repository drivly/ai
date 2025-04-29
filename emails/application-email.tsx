import { Html, Button, Heading, Text, Container, Section, Preview, Head, Tailwind, Body, Hr } from '@react-email/components'

interface ApplicationEmailProps {
  name: string
  position: string
}

export default function ApplicationEmail({ name, position }: ApplicationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className='bg-gray-100 font-sans'>
          <Preview>Thanks for applying to .Do!</Preview>
          <Section className='bg-[#f6f9fc] p-5'>
            <Container className='mx-auto rounded-lg bg-white p-8 shadow-sm'>
              <Heading as='h1'>Application Received</Heading>

              <Text className='text-lg text-gray-700'>Hi {name},</Text>

              <Text className='text-lg text-gray-700'>
                Thank you for applying for the <strong>{position}</strong> position at .Do. We've received your application and are excited to review it.
              </Text>

              <Text className='text-lg text-gray-700'>
                Our team will review your GitHub profile and information you've shared. If there's a potential match, we'll be in touch soon to discuss next steps.
              </Text>

              <Text className='text-lg text-gray-700'>In the meantime, feel free to check out our open source projects and community:</Text>

              <Hr className='my-10 border-gray-200' />

              <Section className='text-center'>
                <Button className='rounded-md bg-[#24292e] px-5 py-2.5 text-sm text-white' href='https://github.com/drivly/ai'>
                  Explore .Do on GitHub
                </Button>
              </Section>

              <Section className='mt-[32px]'>
                <Text className='mb-[8px] text-lg text-gray-700'>Talk soon,</Text>
                <Text className='text-[16px] text-gray-700'>
                  Bryant <br /> Co-Founder & CEO
                </Text>
              </Section>
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
