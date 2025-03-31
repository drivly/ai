import Image from 'next/image'

export default function PayloadIcon({ ...props }) {
  return <Image src='/DrivlyIcon.svg' alt='icon' height={50} width={50} className='h-[21.5px] object-contain invert dark:invert-0' {...props} />
}
