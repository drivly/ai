/**
 * Cloudflare IP validation utility
 *
 * This utility provides functions to check if an IP address is from Cloudflare's network.
 * Cloudflare maintains a list of IP ranges that are used by their network:
 * - https://www.cloudflare.com/ips-v4
 * - https://www.cloudflare.com/ips-v6
 */

import { isIP } from 'net'

const CF_IPV4_RANGES_URL = 'https://www.cloudflare.com/ips-v4'

const CF_IPV6_RANGES_URL = 'https://www.cloudflare.com/ips-v6'

let ipv4Ranges: string[] = []
let ipv6Ranges: string[] = []
let lastFetchTime = 0
const CACHE_DURATION = 86400000 // 24 hours in milliseconds

/**
 * Converts a CIDR notation IP range to a range of IP addresses
 * @param cidr - CIDR notation (e.g., "103.21.244.0/22")
 * @returns Object with start and end IP as numeric values
 */
function cidrToRange(cidr: string): { start: number; end: number } | null {
  try {
    const [ip, bits] = cidr.split('/')
    if (!ip || !bits) return null

    const prefix = Number(bits)
    if (isNaN(prefix)) return null

    const ipParts = ip.split('.').map(Number)
    if (ipParts.length !== 4) return null

    const ipNum = ipParts.reduce((acc, part) => (acc << 8) + part, 0) >>> 0
    const mask = ~((1 << (32 - prefix)) - 1) >>> 0

    return {
      start: ipNum & mask,
      end: ipNum | ~mask,
    }
  } catch (e) {
    console.error('Error parsing CIDR:', e)
    return null
  }
}

/**
 * Converts an IPv4 address to a numeric value
 * @param ip - IPv4 address (e.g., "103.21.244.0")
 * @returns Numeric representation of the IP
 */
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0
}

/**
 * Fetches Cloudflare IP ranges from their official URLs
 */
async function fetchCloudflareIPRanges(): Promise<{ ipv4: string[]; ipv6: string[] }> {
  try {
    const [ipv4Response, ipv6Response] = await Promise.all([fetch(CF_IPV4_RANGES_URL), fetch(CF_IPV6_RANGES_URL)])

    const [ipv4Text, ipv6Text] = await Promise.all([ipv4Response.text(), ipv6Response.text()])

    return {
      ipv4: ipv4Text.split('\n').filter(Boolean),
      ipv6: ipv6Text.split('\n').filter(Boolean),
    }
  } catch (error) {
    console.error('Error fetching Cloudflare IP ranges:', error)
    return { ipv4: [], ipv6: [] }
  }
}

/**
 * Checks if the provided IP address belongs to Cloudflare's network
 * @param ip - IP address to check
 * @returns Promise that resolves to true if the IP belongs to Cloudflare, false otherwise
 */
export async function isCloudflareIP(ip: string): Promise<boolean> {
  if (ipv4Ranges.length === 0 || ipv6Ranges.length === 0 || Date.now() - lastFetchTime > CACHE_DURATION) {
    const ranges = await fetchCloudflareIPRanges()
    ipv4Ranges = ranges.ipv4
    ipv6Ranges = ranges.ipv6
    lastFetchTime = Date.now()
  }

  const ipVersion = isIP(ip)
  if (ipVersion === 0) return false // Invalid IP

  if (ipVersion === 4) {
    const ipNum = ipToNumber(ip)

    for (const range of ipv4Ranges) {
      const cidrRange = cidrToRange(range)
      if (cidrRange && ipNum >= cidrRange.start && ipNum <= cidrRange.end) {
        return true
      }
    }
  } else if (ipVersion === 6) {
    return ipv6Ranges.some((range) => ip.startsWith(range.split('/')[0]))
  }

  return false
}
