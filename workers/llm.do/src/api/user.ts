import { getDistance } from 'geolib'
import { UAParser } from 'ua-parser-js'
import { continents, countries, flags, locations, metros } from '../constants/cf'
import { APIUser } from '../types/api'

export function getUser(request: Request): APIUser {
  const { cf, headers } = request
  const now = new Date()
  let localTime = ''
  const colo = locations[cf?.colo as keyof typeof locations]
  const ip = headers.get('cf-connecting-ip') || ''
  const latitude = cf?.latitude ? Number(cf.latitude) : 0
  const longitude = cf?.longitude ? Number(cf.longitude) : 0

  const userAgent = request.headers.get('user-agent')
  const ua = userAgent ? new UAParser(userAgent).getResult() : { browser: { name: 'unknown' }, os: { name: 'unknown' } }

  const edgeDistance = colo && Math.round(getDistance({ latitude, longitude }, { latitude: colo.lat, longitude: colo?.lon }) / (cf?.country === 'US' ? 1609.344 : 1000))

  try {
    localTime = now.toLocaleString('en-US', {
      timeZone: cf?.timezone ? cf.timezone.toString() : 'UTC',
    })
  } catch (error) {
    console.log({ error })
    localTime = now.toLocaleString('en-US', {
      timeZone: 'UTC',
    })
  }

  return {
    authenticated: false,
    admin: undefined,
    plan: 'Free',
    browser: ua?.browser?.name,
    userAgent: ua?.browser?.name === undefined && userAgent ? userAgent : undefined,
    os: ua?.os?.name as string,
    ip,
    isp: cf?.asOrganization?.toString() || request.headers.get('x-vercel-ip-org') || 'Unknown ISP',
    flag: flags[(cf?.country as keyof typeof flags) || 'US'],
    zipcode: cf?.postalCode?.toString() || '',
    city: cf?.city?.toString() || '',
    metro: metros[Number(cf?.metroCode) as keyof typeof metros],
    region: cf?.region?.toString() || '',
    country: countries[cf?.country as keyof typeof countries]?.name,
    continent: continents[cf?.continent as keyof typeof continents],
    requestId: headers.get('cf-ray') + '-' + cf?.colo,
    localTime,
    timezone: cf?.timezone?.toString() || 'UTC',
    edgeLocation: colo?.city,
    edgeDistanceMiles: cf?.country === 'US' ? edgeDistance : undefined,
    edgeDistanceKilometers: cf?.country === 'US' ? undefined : edgeDistance,
    latencyMilliseconds: cf?.clientTcpRtt ? Number(cf.clientTcpRtt) : 0,
    recentInteractions: 0,
    trustScore: (cf?.botManagement as { score: number })?.score,
  }
}
