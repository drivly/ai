import { domains } from '@/.velite'

const trustedDomains = domains.map((domain) => domain.domain)

export async function syncAuthToDomains(token: string) {
  const isProduction = window.location.protocol === 'https:'
  const currentDomain = window.location.hostname

  // For each trusted domain, send the token
  return Promise.allSettled(
    trustedDomains.map(async (domain) => {
      // Skip current domain
      if (currentDomain === domain) return true

      try {
        const response = await fetch(`https://${domain}/authsync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            isProduction,
          }),
          mode: 'cors',
          credentials: 'include',
        })

        return response.ok
      } catch (error) {
        console.error(`Auth sync failed for ${domain}:`, error)
        return false
      }
    }),
  )
}

export async function syncLogoutToDomains() {
  const isProduction = window.location.protocol === 'https:'
  const currentDomain = window.location.hostname

  // For each trusted domain, send logout
  return Promise.allSettled(
    trustedDomains.map(async (domain) => {
      // Skip current domain
      if (currentDomain === domain) return true

      try {
        const response = await fetch(`https://${domain}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isProduction }),
          credentials: 'include',
        })

        return response.ok
      } catch (error) {
        console.error(`Logout sync failed for ${domain}:`, error)
        return false
      }
    }),
  )
}
