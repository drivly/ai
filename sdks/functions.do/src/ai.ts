import { AI } from '../index'

export const research = AI({
  research: {
    summary: 'comprehensive summary of the research topic',
    findings: ['key discoveries and insights'],
    sources: ['list of sources consulted'],
    confidence: 'confidence score from 0-100',
  },

  researchCompany: {
    industry: 'primary industry the company operates in',
    founded: 'year the company was founded',
    size: 'approximate number of employees',
    revenue: 'estimated annual revenue',
    products: ['main products or services'],
    competitors: ['main competitors in the market'],
    recentNews: ['recent significant news or developments'],
  },

  researchPersonalBackground: {
    education: 'educational background summary',
    previousRoles: ['previous job titles or positions'],
    skills: ['notable skills and expertise'],
    achievements: ['significant professional achievements'],
    interests: ['professional and personal interests if public'],
  },

  researchSocialActivity: {
    platforms: ['social media platforms where the person is active'],
    engagement: 'level of social media engagement (high/medium/low)',
    topics: ['common topics discussed on social media'],
    connections: 'approximate number of followers/connections',
    influence: 'assessment of online influence in their field',
  },
})
