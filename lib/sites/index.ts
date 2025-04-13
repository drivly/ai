import { sites } from '@/.velite'
import { codeExample } from '@/components/sites/constants/code-example'
import { ai } from '@/config/ai.config'

/**
 * Site content type definition
 */
interface SiteContent {
  title: string;
  description: string;
  headline?: string;
  subhead?: string;
  brandColor?: string;
  badge?: string;
  codeExample?: string | object;
  codeLang?: string;
  content?: any;
  group?: string;
}

/**
 * Find site content based on domain with fallback
 * @param domain Domain to find content for
 * @param includeHero Whether to include hero content fields
 * @returns Site content with fallback if not found
 */
export async function findSiteContent(domain: string, includeHero = false): Promise<SiteContent> {
  const site = domain === '%5Bdomain%5D' ? 'workflows.do' : (domain ?? 'llm.do');
  
  const siteContent = sites.find((s: any) => {
    const titleDomain = s.title.split(' - ')[0].toLowerCase();
    return site === titleDomain.toLowerCase() || 
           site === titleDomain.toLowerCase().replace('.do', '') ||
           s.title.toLowerCase().includes(site.toLowerCase());
  });
  
  if (!siteContent) {
    try {
      const { output } = await ai.generateSiteContent({ domain: site });
      
      return {
        title: output.title || site,
        description: output.description || `${site} | .do Business-as-Code`,
        headline: output.headline || site,
        subhead: output.subhead || 'Powered by .do',
        badge: output.badge || 'AI without Complexity',
        codeExample: output.codeExample || codeExample,
        codeLang: output.codeLang || 'json',
        brandColor: output.brandColor,
        group: output.group || 'other',
      };
    } catch (error) {
      console.error(`Error generating content for ${site}:`, error);
      
      const fallbackContent: SiteContent = {
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
          codeLang: 'json',
        };
      }
      
      return fallbackContent;
    }
  }
  
  return siteContent;
}
