# [workflows.do](https://workflows.do)

[![npm version](https://img.shields.io/npm/v/workflows.do.svg)](https://www.npmjs.com/package/workflows.do)
[![npm downloads](https://img.shields.io/npm/dm/workflows.do.svg)](https://www.npmjs.com/package/workflows.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

A powerful SDK for creating AI-powered workflows with strongly-typed functions.

## Installation

```bash
npm install workflows.do
# or
yarn add workflows.do
# or
pnpm add workflows.do
```

## Overview

The `workflows.do` SDK provides a simple yet powerful way to define AI-powered workflows with strongly-typed functions. It allows you to:

- Define event-driven workflows with AI capabilities
- Create strongly-typed AI function schemas
- Integrate with external APIs and databases
- Build complex, multi-step AI processes with full TypeScript support

## Usage

### Creating an AI Workflow

```typescript
import { AI } from 'workflows.do'

export default AI({
  onUserSignup: async (event, { ai, api, db }) => {
    const { name, email, company } = event

    // Enrich content details with lookup from external data sources
    const enrichedContact = await api.apollo.search({ name, email, company })
    const socialProfiles = await api.peopleDataLabs.findSocialProfiles({ name, email, company })
    const githubProfile = socialProfiles.github ? await api.github.profile({ name, email, company, profile: socialProfiles.github }) : undefined

    // Using the enriched contact details, do deep research on the company and personal background
    const companyProfile = await ai.researchCompany({ company })
    const personalProfile = await ai.researchPersonalBackground({ name, email, enrichedContact })
    const socialActivity = await ai.researchSocialActivity({ name, email, enrichedContact, socialProfiles })
    const githubActivity = githubProfile ? await ai.summarizeGithubActivity({ name, email, enrichedContact, githubProfile }) : undefined

    // Schedule a highly personalized sequence of emails to optimize onboarding and activation
    const emailSequence = await ai.personalizeEmailSequence({ name, email, company, personalProfile, socialActivity, companyProfile, githubActivity })
    await api.scheduleEmails({ emailSequence })

    // Summarize everything, save to the database, and post to Slack
    const details = { enrichedContact, socialProfiles, githubProfile, companyProfile, personalProfile, socialActivity, githubActivity, emailSequence }
    const summary = await ai.summarizeContent({ length: '3 sentences', name, email, company, ...details })
    const { url } = await db.users.create({ name, email, company, summary, ...details })
    await api.slack.postMessage({ channel: '#signups', content: { name, email, company, summary, url } })
  },
})
```

### Defining AI Function Schemas

You can define strongly-typed AI function schemas that provide TypeScript type safety for your AI functions:

```typescript
export const ai = AI({
  writeBook: async ({ ai, db, api, args }) => {
    // Step 1: Create book proposal with provided args
    const proposal = await ai.createBookProposal(args)

    // Step 2: Generate table of contents based on proposal
    const toc = await ai.createTableOfContents({ proposal })

    // Step 3: Create detailed outlines for each chapter
    const chapterOutlines = await Promise.all(
      toc.chapters.map(async (chapter, idx) => {
        return ai.createChapterOutline({
          bookTitle: proposal.title,
          chapterNumber: (idx + 1).toString(),
          chapterTitle: chapter.title,
        })
      }),
    )

    // Step 4: Write all sections for each chapter
    const completedChapters = await Promise.all(
      chapterOutlines.map(async (outline, idx) => {
        const chapterNumber = idx + 1

        // Write each section in parallel for efficiency
        const sections = await Promise.all(
          outline.sections.map(async (section) => {
            return ai.writeSection({
              bookTitle: proposal.title,
              chapterNumber: chapterNumber.toString(),
              chapterTitle: outline.chapterTitle,
              sectionTitle: section.title,
            })
          }),
        )

        return {
          chapterNumber,
          chapterTitle: outline.chapterTitle,
          sections,
        }
      }),
    )

    // Step 5: Review each chapter for quality and consistency
    const chapterReviews = await Promise.all(
      completedChapters.map(async (chapter) => {
        return ai.reviewChapter({
          bookTitle: proposal.title,
          chapterNumber: chapter.chapterNumber.toString(),
          chapterTitle: chapter.chapterTitle,
        })
      }),
    )

    // Step 6: Perform comprehensive book review
    const bookReview = await ai.reviewBook({ bookTitle: proposal.title })

    // Step 7: Edit book based on review feedback
    const bookEdits = await ai.editBook({ bookTitle: proposal.title })

    // Step 8: Prepare final materials for publication
    const book = await ai.prepareForPublication({ bookTitle: proposal.title })

    // Step 9: Save book to database
    const { url } = await db.books.create({
      title: proposal.title,
      summary: proposal.summary,
      toc,
      chapterOutlines,
      completedChapters,
      chapterReviews,
      bookReview,
      bookEdits,
      publicationPrep,
    })
    await api.slack.awaitApproval({ channel: '#books', content: { title: proposal.title, message: 'Book ready for review 🚀', url } })

    // Step 10: Return complete book package with all components
    const publishedBook = await api.amazon.kindle.publish({ book })
    await api.slack.postMessage({ channel: '#books', content: { title: proposal.title, message: 'Book published 🎉', url: publishedBook.url } })

    return {
      proposal,
      tableOfContents: toc,
      chapterOutlines,
      completedChapters,
      chapterReviews,
      bookReview,
      bookEdits,
      publicationPrep,
    }
  },

  // Book Proposal - Initial concept and outline
  createBookProposal: {
    title: 'proposed title of the book',
    subtitle: 'proposed subtitle of the book',
    author: 'name of the author',
    targetAudience: ['primary audience segments for the book'],
    marketAnalysis: 'analysis of the current market for this type of book',
    competitiveBooks: ['list of similar books in the market'],
    uniqueSellingPoints: ['what makes this book different and valuable'],
    keyTakeaways: ['main insights readers will gain'],
    marketingPotential: 'assessment of marketing opportunities',
    coverDescription: 'visual description of the layout and image of the book cover',
    estimatedWordCount: 'approximate word count for the entire book',
    estimatedTimeToComplete: 'timeline for completing the manuscript',
    summary: 'one paragraph summary of the book concept',
  },

  // Table of Contents - Structure of the book
  createTableOfContents: {
    bookTitle: 'title of the book',
    introduction: 'brief description of the introduction',
    chapters: [
      {
        title: 'chapter title',
        summary: 'brief summary of the chapter content',
        sections: [
          {
            title: 'section title',
            summary: 'brief description of the section content',
          },
        ],
        estimatedPages: 'estimated number of pages for this chapter',
      },
    ],
    conclusion: 'brief description of the conclusion',
    appendices: ['list of potential appendices if applicable'],
    bibliography: 'description of reference sources if applicable',
    estimatedTotalPages: 'estimated total page count for the book',
  },

  // Chapter Outline - Detailed plan for a specific chapter
  createChapterOutline: {
    bookTitle: 'title of the book',
    chapterNumber: 'number of the chapter',
    chapterTitle: 'title of the chapter',
    openingHook: 'engaging opening to capture reader interest',
    keyPoints: ['main points to be covered in the chapter'],
    sections: [
      {
        title: 'section title',
        content: 'detailed description of section content',
        keyIdeas: ['key ideas to be conveyed in this section'],
        examples: ['examples or case studies to include'],
        transitions: 'how this section connects to the next',
      },
    ],
    conclusion: 'how the chapter will wrap up',
    exercises: ['potential exercises or reflection questions for readers'],
    references: ['key references or citations for this chapter'],
    visualElements: ['diagrams, charts, or illustrations to include'],
  },

  // Section Writing - Content for a specific section
  writeSection: {
    bookTitle: 'title of the book',
    chapterNumber: 'number of the chapter',
    chapterTitle: 'title of the chapter',
    sectionTitle: 'title of the section',
    content: 'fully written content for the section',
    keyQuotes: ['memorable quotes or statements from this section'],
    citations: ['citations or references used in this section'],
    images: ['descriptions of images or diagrams to include'],
    pullQuotes: ['text that could be highlighted as pull quotes'],
    wordCount: 'word count for this section',
  },

  // Chapter Review - Evaluation of a completed chapter
  reviewChapter: {
    bookTitle: 'title of the book',
    chapterNumber: 'number of the chapter',
    chapterTitle: 'title of the chapter',
    strengthAnalysis: ['strengths of the chapter'],
    weaknessAnalysis: ['areas that need improvement'],
    flowAssessment: 'evaluation of how well the narrative flows',
    clarityAssessment: 'evaluation of clarity and readability',
    engagementAssessment: 'evaluation of how engaging the content is',
    factsToVerify: ['factual claims that should be verified'],
    suggestedRevisions: ['specific suggestions for revision'],
    consistencyCheck: 'assessment of consistency with other chapters',
    overallRating: 'rating on a scale of 1-10',
    nextStepsRecommendation: 'recommended next steps for improvement',
  },

  // Book Review - Comprehensive review of the entire manuscript
  reviewBook: {
    bookTitle: 'title of the book',
    overallAssessment: 'comprehensive evaluation of the manuscript',
    structureAnalysis: 'assessment of the book structure and organization',
    narrativeFlowAnalysis: 'evaluation of how the narrative progresses',
    thematicConsistency: 'assessment of thematic consistency throughout',
    audienceAlignment: 'how well the book aligns with target audience',
    marketPotential: 'assessment of commercial potential',
    strengthHighlights: ['major strengths of the manuscript'],
    improvementAreas: ['areas needing significant improvement'],
    missingElements: ['important content or elements that are missing'],
    redundancies: ['redundant or repetitive content to eliminate'],
    titleFeedback: 'assessment of title effectiveness',
    coverSuggestions: 'suggestions for cover design elements',
    marketingAngles: ['potential marketing angles to emphasize'],
    finalRecommendations: ['prioritized list of final recommendations'],
  },

  // Book Editing - Specific edits for improving the manuscript
  editBook: {
    bookTitle: 'title of the book',
    structuralEdits: ['suggestions for reorganizing content'],
    developmentalEdits: ['suggestions for expanding or developing ideas'],
    lineEdits: ['specific line-level edits for clarity and style'],
    copyedits: ['grammar, punctuation, and spelling corrections'],
    factChecking: ['factual errors to correct'],
    consistencyEdits: ['inconsistencies to resolve'],
    styleGuideApplication: 'how to apply a consistent style guide',
    audienceConsiderations: 'edits to better target the audience',
    paceAdjustments: 'suggestions for improving narrative pace',
    toneRefinements: 'adjustments to maintain consistent tone',
    dialogueImprovements: 'ways to improve any dialogue',
    descriptionEnhancements: 'ways to enhance descriptive passages',
    transitionImprovements: 'ways to improve transitions between sections',
  },

  // Book Publication Preparation - Final steps before publication
  prepareForPublication: {
    bookTitle: 'title of the book',
    finalTitleRecommendation: 'final recommendation for title and subtitle',
    blurb: 'promotional book description for back cover and marketing',
    keySellingPoints: ['key selling points to emphasize in marketing'],
    targetCategories: ['book categories and genres for listing'],
    keywordRecommendations: ['keywords for search optimization'],
    comparableTitles: ['comparable successful titles for positioning'],
    audienceDescription: 'detailed description of target audience',
    marketingHooks: ['marketing hooks and angles'],
    excerptSuggestions: ['passages that would work well as excerpts'],
    endorsementStrategy: 'strategy for obtaining endorsements',
    launchStrategy: 'recommended approach for book launch',
    pricingRecommendation: 'suggested pricing strategy',
    formatRecommendations: ['recommended formats (hardcover, ebook, etc.)'],
    distributionChannels: ['recommended distribution channels'],
  },
})
```

## API Reference

### AI(config)

The main function to create AI workflows and function schemas.

**Parameters:**

- `config`: An object containing event handlers and function schemas

**Returns:**

- An AI instance with typed methods based on the provided schemas

### Context Object

Each event handler receives a context object with the following properties:

- `ai`: AI functions defined in your schema
- `api`: External API integrations
- `db`: Database access for storing and retrieving data

## Workflows as Functions

A key concept in the Workflows.do platform is that **Workflows themselves are Functions**. This means:

1. Workflows can be invoked like any other function
2. Workflows can be composed and nested within other workflows
3. Workflows can be used as tools by AI Agents
4. Workflows can be triggered by events or called directly by humans

This design creates a powerful compositional model where complex business processes can be built from simpler building blocks.

## Function Types in Workflows

Workflows can incorporate all four function types supported by the platform:

### 1. Generation Functions

Generation functions use generative AI to create content or objects based on input parameters:

```typescript
// Using a Generation function in a workflow
const summary = await ai.summarizeContent({
  content: longText,
  maxLength: 200,
})
```

### 2. Code Functions

Code functions execute deterministic code for precise calculations and data processing:

```typescript
// Using a Code function in a workflow
const processedData = await ai.processDataset({
  data: rawData,
  operations: ['normalize', 'filter'],
})
```

### 3. Agentic Functions

Agentic functions delegate tasks to autonomous AI agents:

```typescript
// Using an Agentic function in a workflow
const researchResults = await ai.researchTopic({
  topic: 'Emerging Technologies',
  depth: 'Comprehensive',
})
```

### 4. Human Functions

Human functions incorporate human workers into your workflows:

```typescript
// Using a Human function in a workflow
const approvalResult = await ai.getManagerApproval({
  proposal: proposalData,
  deadline: '24h',
})
```

## Workflows as Tools

Workflows can serve as powerful tools for both AI Agents and human operators:

```typescript
// An agent using a workflow as a tool
const salesAgent = Agent({
  name: 'SalesBot',
  tools: [
    // The lead qualification workflow is available as a tool
    ai.leadQualificationWorkflow,
    ai.proposalGenerationWorkflow,
  ],
})
```

This capability creates a seamless experience where the same business logic can be accessed by both AI systems and human users.

## Examples

### Content Generation Workflow

```typescript
import { AI } from 'workflows.do'

export default AI({
  generateBlogPost: async (event, { ai, api, db }) => {
    const { topic, keywords, targetAudience } = event

    // Research the topic
    const research = await ai.researchTopic({ topic, keywords })

    // Create an outline
    const outline = await ai.createOutline({ topic, research, targetAudience })

    // Write the blog post
    const blogPost = await ai.writeBlogPost({ topic, outline, research })

    // Create images for the blog post
    const images = await api.dalle.generateImages({
      prompt: `Image for blog post about ${topic}`,
      n: 3,
    })

    // Save to database
    const { url } = await db.blogPosts.create({
      title: blogPost.title,
      content: blogPost.content,
      images,
      metadata: {
        topic,
        keywords,
        targetAudience,
        research,
        outline,
      },
    })

    return {
      blogPost,
      images,
      url,
    }
  },
})
```

### Customer Support Workflow

```typescript
import { AI } from 'workflows.do'

export default AI({
  handleSupportTicket: async (event, { ai, api, db }) => {
    const { ticketId, customerMessage, customerId } = event

    // Get customer history
    const customerHistory = await db.customers.findOne({ id: customerId })

    // Analyze the support ticket
    const analysis = await ai.analyzeSupportTicket({
      customerMessage,
      customerHistory,
    })

    // Generate a response
    const response = await ai.generateSupportResponse({
      customerMessage,
      analysis,
      customerHistory,
    })

    // Update the ticket in the database
    await db.supportTickets.update(ticketId, {
      status: 'responded',
      response,
      analysis,
    })

    // Send the response to the customer
    await api.email.send({
      to: customerHistory.email,
      subject: `Re: Support Ticket #${ticketId}`,
      body: response.message,
    })

    return {
      ticketId,
      response,
      analysis,
    }
  },
})
```

## License

MIT
