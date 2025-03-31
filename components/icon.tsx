'use client'

import Image from 'next/image'

export default function PayloadIcon({ ...props }) {
  return <Image src='/DrivlyIcon.svg' alt='icon' height={50} width={50} className='h-[21.5px] object-contain invert dark:invert-0' {...props} />
}

// PayloadIcon in svg format
function Logo() {
  return (
    <svg width='300' height='276' viewBox='0 0 300 276' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M88.5 72.1923L52.5 49.5V226.5L88.5 202.295V72.1923Z' fill='white' />
      <path d='M159.5 58.8077L112.5 31.5V244.5L159.5 215.372V58.8077Z' fill='white' />
      <path d='M183.5 47.6538L247.5 16.5V259.5L183.5 226.269V47.6538Z' fill='white' />
    </svg>
  )
}
