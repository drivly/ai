import { z } from 'zod'
import { ai } from './ai'

/**
 * Generate a strategy for video content on a given topic
 */
export const createVideoStrategy = async ({ 
  topic, 
  audience, 
  keywords 
}: { 
  topic: string; 
  audience: string; 
  keywords: string[] 
}) => {
  return ai`Create a video content strategy for a YouTube video about ${topic} targeting ${audience} with keywords ${keywords}`({
    schema: z.object({
      title: z.string().describe("Catchy title for the video"),
      outline: z.array(z.object({
        section: z.string(),
        keyPoints: z.array(z.string()),
        visualIdeas: z.array(z.string())
      })),
      tone: z.string().describe("Recommended tone for the video"),
      duration: z.string().describe("Estimated duration in minutes"),
      targetAudience: z.string().describe("Specific audience segment"),
      searchOptimization: z.array(z.string()).describe("Search terms to target")
    }),
    temperature: 0.7,
  })
}

/**
 * Create a script for a video including narration text
 */
export const writeVideoScript = async ({ 
  topic, 
  outline, 
  tone, 
  duration 
}: { 
  topic: string; 
  outline: Array<{
    section: string;
    keyPoints: string[];
    visualIdeas: string[];
  }>; 
  tone: string; 
  duration: string 
}) => {
  return ai`Write a script for a ${duration} minute video about ${topic} with tone ${tone} following this outline: ${JSON.stringify(outline)}`({
    schema: z.object({
      title: z.string().describe("Video title"),
      introduction: z.string().describe("Opening narration"),
      sections: z.array(z.object({
        title: z.string(),
        narration: z.string(),
        visualNotes: z.array(z.string())
      })),
      conclusion: z.string().describe("Closing narration"),
      callToAction: z.string().describe("What viewers should do after watching"),
      content: z.string().describe("Full script content")
    }),
    temperature: 0.7,
  })
}

/**
 * Generate optimized title, description, and tags for YouTube
 */
export const createYoutubeMetadata = async ({ 
  title, 
  content, 
  keywords 
}: { 
  title: string; 
  content: string; 
  keywords: string[] 
}) => {
  return ai`Create optimized YouTube metadata for a video titled "${title}" with content: ${content} and target keywords: ${keywords}`({
    schema: z.object({
      title: z.string().describe("SEO-optimized title (max 100 characters)"),
      description: z.string().describe("Detailed description with keywords (max 5000 characters)"),
      tags: z.array(z.string()).describe("Relevant tags for maximum discoverability"),
      category: z.string().describe("YouTube category ID"),
      thumbnailIdeas: z.array(z.string()).describe("Ideas for thumbnail design")
    }),
    temperature: 0.7,
  })
}
