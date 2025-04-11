import { sites } from '@/.velite'

/**
 * Find site content based on domain
 * @param domain Domain to find content for
 * @returns Site content or undefined if not found
 */
export function findSiteContent(domain: string) {
  const site = domain ?? 'llm.do';
  
  const siteContent = sites.find(s => {
    const titleDomain = s.title.split(' - ')[0].toLowerCase();
    return site === titleDomain.toLowerCase() || 
           site === titleDomain.toLowerCase().replace('.do', '') ||
           s.title.toLowerCase().includes(site.toLowerCase());
  });
  
  return siteContent;
}

/**
 * Get fallback content for a domain
 * @param domain Domain to get fallback content for
 * @param includeHero Whether to include hero content fields
 * @returns Fallback content object
 */
export function getFallbackContent(domain: string, includeHero = false) {
  const site = domain ?? 'llm.do';
  
  const fallbackContent = {
    title: site,
    description: `${site} | .do Business-as-Code`,
  };
  
  if (includeHero) {
    return {
      ...fallbackContent,
      headline: site,
      subhead: 'Powered by .do',
    };
  }
  
  return fallbackContent;
}
