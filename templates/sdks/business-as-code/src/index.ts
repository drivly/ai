import { defineBusinessModel } from 'business-as-code';

export default defineBusinessModel({
  name: 'My Business',
  
  model: {
    storyBrand: {
      hero: {
        identity: 'Target customers',
        desire: 'What they want to achieve'
      },
      problem: {
        external: 'Visible problem they face',
        internal: 'How it makes them feel',
        philosophical: 'Why it is unfair',
        villain: 'What is causing the problem'
      },
      guide: {
        empathy: 'How you understand their pain',
        authority: 'Why they should trust you'
      },
      plan: ['Step 1', 'Step 2', 'Step 3'],
      callToAction: {
        direct: 'Main conversion action',
        transitional: 'Lower commitment action'
      },
      failure: ['What happens if they do not act'],
      success: ['What happens if they do act']
    },
    leanCanvas: {
      problem: ['Problem 1', 'Problem 2', 'Problem 3'],
      solution: ['Solution 1', 'Solution 2', 'Solution 3'],
      uniqueValueProposition: 'What makes your solution special',
      customerSegments: ['Segment 1', 'Segment 2'],
      channels: ['Channel 1', 'Channel 2'],
      keyMetrics: ['Metric 1', 'Metric 2'],
      costStructure: ['Cost 1', 'Cost 2'],
      revenueStreams: ['Revenue 1', 'Revenue 2']
    }
  },
  
  async analyze() {
    const competitors = await this.research.competitors();
    const market = await this.research.marketSize();
    
    return {
      competitors,
      market,
      insights: 'Business insights based on analysis'
    };
  },
  
  async plan() {
    return {
      roadmap: ['Q1 Goals', 'Q2 Goals', 'Q3 Goals', 'Q4 Goals'],
      strategy: 'Business strategy description'
    };
  }
});
