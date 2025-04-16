import Link from 'next/link'
import { DotdoLogo } from '../shared/dotdo-logo'
export default function Logo() {
  return (
    <Link href='/'>
      <DotdoLogo className='flex h-[50px] w-[94px] items-center justify-start' as='div' />
    </Link>
  )
}
