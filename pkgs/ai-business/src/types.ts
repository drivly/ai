export interface StoryBrand {
  hero: string;
  problem: string;
  guide: string;
  solution: string;
  callToAction: string;
  success: string;
  failure: string;
  transformation: string;
}

export interface LeanCanvas {
  problem: string[];
  customerSegments: string[];
  uniqueValueProposition: string;
  solution: string[];
  channels: string[];
  revenueStreams: string[];
  costStructure: string[];
  keyMetrics: string[];
  unfairAdvantage: string;
}

export interface Goal {
  objective: string;
}

export interface BusinessConfig {
  name: string;
  url: string;
  vision: string;
  storyBrand: StoryBrand;
  leanCanvas: LeanCanvas;
  goals: Goal[];
}

export interface BusinessInterface extends BusinessConfig {
}
