import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Social } from './social'

export default async function SignIn() {
  return (
    <Card className='mx-auto w-full max-w-[448px]'>
      <CardHeader>
        <CardTitle className='text-[18px] leading-[26px] md:text-[20px] md:leading-[28px]'>Sign In</CardTitle>
        <CardDescription className='text-[12px] leading-[20px] md:text-[14px] md:leading-[22px]'>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-[16px]'>
          <Social />
        </div>
      </CardContent>
    </Card>
  )
}
