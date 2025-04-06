/**
 * Cloudflare-related constants for API responses
 */

export const countries: Record<string, { name: string }> = {
  US: { name: 'United States' },
  CA: { name: 'Canada' },
  UK: { name: 'United Kingdom' },
  AU: { name: 'Australia' },
  DE: { name: 'Germany' },
  FR: { name: 'France' },
  JP: { name: 'Japan' },
}

export const continents: Record<string, string> = {
  NA: 'North America',
  SA: 'South America',
  EU: 'Europe',
  AF: 'Africa',
  AS: 'Asia',
  OC: 'Oceania',
  AN: 'Antarctica',
}

export const flags: Record<string, string> = {
  US: '🇺🇸',
  CA: '🇨🇦',
  UK: '🇬🇧',
  AU: '🇦🇺',
  DE: '🇩🇪',
  FR: '🇫🇷',
  JP: '🇯🇵',
}

export const metros: Record<number, string> = {
  623: 'Minneapolis-St. Paul',
  524: 'Atlanta',
  602: 'Chicago',
  803: 'Dallas-Fort Worth',
  807: 'Denver',
  828: 'Los Angeles',
  506: 'Miami',
  501: 'New York',
  753: 'Phoenix',
  825: 'San Francisco',
  819: 'Seattle',
  511: 'Washington DC',
}

export const locations: Record<string, { city: string; lat: number; lon: number }> = {
  ORD: { city: 'Chicago', lat: 41.8781, lon: -87.6298 },
  DFW: { city: 'Dallas', lat: 32.7767, lon: -96.797 },
  IAD: { city: 'Washington DC', lat: 38.9072, lon: -77.0369 },
  LAX: { city: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  SJC: { city: 'San Jose', lat: 37.3382, lon: -121.8863 },
  ATL: { city: 'Atlanta', lat: 33.749, lon: -84.388 },
  LHR: { city: 'London', lat: 51.5074, lon: -0.1278 },
  FRA: { city: 'Frankfurt', lat: 50.1109, lon: 8.6821 },
  CDG: { city: 'Paris', lat: 48.8566, lon: 2.3522 },
  NRT: { city: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  SYD: { city: 'Sydney', lat: -33.8688, lon: 151.2093 },
}
