import { sites } from '@/.velite'
import { codeExample } from '@/components/sites/constants/code-example'

/**
 * Find site content based on domain with fallback
 * @param domain Domain to find content for
 * @param includeHero Whether to include hero content fields
 * @returns Site content with fallback if not found
 */
export function findSiteContent(domain: string, includeHero = false) {
  const site = domain ?? 'llm.do';
  
  const siteContent = sites.find(s => {
    const titleDomain = s.title.split(' - ')[0].toLowerCase();
    return site === titleDomain.toLowerCase() || 
           site === titleDomain.toLowerCase().replace('.do', '') ||
           s.title.toLowerCase().includes(site.toLowerCase());
  });
  
  if (!siteContent) {
    const fallbackContent = {
      title: site,
      description: `${site} | .do Business-as-Code`,
    };
    
    if (includeHero) {
      return {
        ...fallbackContent,
        headline: site,
        subhead: 'Powered by .do',
        badge: 'AI without Complexity',
        codeExample: codeExample,
      };
    }
    
    return fallbackContent;
  }
  
  return siteContent;
}
