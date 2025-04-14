import Link from 'next/link'
import { DotdoLogo } from './shared/dotdo-logo'
export default function Logo() {
  return (
    <Link href='/'>
      <DotdoLogo className='flex items-center justify-start h-[50px] w-[94px]' />
    </Link>
  )
}
