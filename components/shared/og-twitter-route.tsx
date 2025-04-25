/* eslint-disable @next/next/no-img-element */
import { getContent } from '@/app/(sites)/sites/[domain]/content'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = '.do'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export async function GET(request: NextRequest, { params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params

  const logoData = await readFile(join(process.cwd(), 'app', 'ogBackground1.png'))
  const logoSrc = Uint8Array.from(logoData).buffer

  const fontReg = await readFile(join(process.cwd(), 'app', '(sites)', 'fonts', 'IBMPlexMono-Regular.ttf'))
  const fontMed = await readFile(join(process.cwd(), 'app', '(sites)', 'fonts', 'IBMPlexMono-Medium.ttf'))

  const content = await getContent(domain)
  const [title, subtitle] = content.seo.title.split(' - ') || [domain, 'Business-as-Code']

  return new ImageResponse(
    (
      <div
        tw='relative font-medium text-white'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        {/* @ts-expect-error */}
        <img src={logoSrc} height='630' alt='logo' />
        <div style={{ fontFamily: 'IBM-med' }} tw='absolute left-[90px] top-[87px] text-[47.25px] leading-normal font-medium'>
          .do/
        </div>
        <div style={{ fontFamily: 'IBM-med' }} tw='absolute left-[90px] top-[350px] w-[670px] tracking-tight text-[72px] leading-normal font-medium'>
          {title}
        </div>
        <div style={{ fontFamily: 'IBM-reg' }} tw='text-[40px] text-[#949494] tracking-tight font-normal mt-[10px] absolute left-[90px] bottom-[90px]'>
          {subtitle}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'IBM-reg',
          data: fontReg,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'IBM-med',
          data: fontMed,
          style: 'normal',
          weight: 500,
        },
      ],
    },
  )
}
