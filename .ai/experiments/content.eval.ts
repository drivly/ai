import { evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'

const battleScorer = Battle as any

const contentTypes = ['blogPost', 'landingPage', 'productDescription', 'emailNewsletter']

const models = [
  'google/gemini-2.5-pro-preview-03-25',
  'google/gemini-2.5-flash-preview',
  'openai/gpt-4.5-preview',
  'openai/gpt-4.1',
  'anthropic/claude-3.7-sonnet',
  'meta-llama/llama-4-maverick',
]

const tones = ['professional', 'conversational', 'enthusiastic', 'technical']

evalite('Content Generation Experiments', {
  data: () =>
    contentTypes.flatMap((contentType) =>
      models.flatMap((model) =>
        tones.map((tone) => ({
          input: { contentType, model, tone },
          expected: {
            /* optional baseline */
          },
        })),
      ),
    ),
  task: async ({ contentType, model, tone }) => {
    let result

    switch (contentType) {
      case 'blogPost':
        result = await ai.generateBlogPost(
          { topic: 'AI-powered business automation', tone },
          {
            title: 'SEO-optimized blog post title',
            introduction: 'engaging introduction to the topic',
            sections: [
              {
                heading: 'section heading',
                content: 'section content with key points and examples',
              },
            ],
            conclusion: 'summary of key points and call to action',
            tags: ['relevant keywords for the post'],
          },
          { model },
        )
        break
      case 'landingPage':
        result = await ai.generateLandingPage(
          { product: 'Business-as-Code platform', tone },
          {
            headline: 'attention-grabbing headline',
            subheadline: 'supporting statement that explains the value proposition',
            features: [
              {
                title: 'feature title',
                description: 'feature description highlighting benefits',
              },
            ],
            callToAction: 'clear call to action',
          },
          { model },
        )
        break
      case 'productDescription':
        result = await ai.generateProductDescription(
          { product: 'AI Function SDK', tone },
          {
            name: 'product name',
            tagline: 'short, memorable tagline',
            description: 'detailed product description',
            benefits: ['key benefit points'],
            specifications: ['technical specifications'],
          },
          { model },
        )
        break
      case 'emailNewsletter':
        result = await ai.generateEmailNewsletter(
          { topic: 'Latest AI developments', tone },
          {
            subject: 'engaging email subject line',
            greeting: 'personalized greeting',
            content: 'newsletter content with sections and highlights',
            callToAction: 'clear call to action',
            signature: 'email signature and contact information',
          },
          { model },
        )
        break
      default:
        result = { error: 'Unknown content type' }
    }

    return result
  },
  scorers: [battleScorer],
  experimental_customColumns: async (data) => [
    { label: 'Content Type', value: data.input.contentType },
    { label: 'Model', value: data.input.model },
    { label: 'Tone', value: data.input.tone },
    { label: 'Output', value: JSON.stringify(data.output, null, 2) },
  ],
})
