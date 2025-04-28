/* eslint-disable @next/next/no-img-element */
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

export async function GET(request: NextRequest) {
  const docTitle = request.nextUrl.searchParams.get('title')

  const fontMed = await readFile(join(process.cwd(), 'app', '(sites)', 'fonts', 'IBMPlexMono-Medium.ttf'))
  const fontReg = await readFile(join(process.cwd(), 'app', '(sites)', 'fonts', 'IBMPlexMono-Regular.ttf'))
  const background = await readFile(join(process.cwd(), 'app', 'OG_BG_1.png'))

  const backgroundSrc = Uint8Array.from(background).buffer

  let title

  if (docTitle && docTitle.includes(' - ') && docTitle.split(' - ').length === 2) {
    title = docTitle.split(' - ')[0]
  } else {
    title = docTitle
  }

  return new ImageResponse(
    (
      <div
        tw='relative text-white'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        {/* @ts-expect-error */}
        <img src={backgroundSrc} height='630' alt='logo' />
        <div style={{ fontFamily: 'IBM-med' }} tw='absolute left-[90px] top-[87px] text-[47.25px] leading-normal'>
          .do/
        </div>
        <div style={{ fontFamily: 'IBM-med' }} tw='absolute left-[90px] top-[350px] w-[670px] tracking-tight text-[72px] leading-normal'>
          {title}
        </div>
        <div style={{ fontFamily: 'IBM-reg' }} tw='text-[40px] text-[#949494] tracking-tight mt-[10px] absolute left-[90px] bottom-[90px]'>
          dotdo.ai/docs
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
