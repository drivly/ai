import Script from 'next/script'
import React from 'react'

export const GoogleAnalytics = () => {
  const trackingId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

  if (!trackingId) {
    return null
  }

  return (
    <>
      <Script strategy='afterInteractive' src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
      <Script
        id='google-analytics'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}');
          `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics
