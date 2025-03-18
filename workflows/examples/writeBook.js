import { AI } from 'functions.do'

export const ai = AI({

  writeBook: async ({ ai, args }) => {
    
    // Step 1: Create book proposal with provided args
    const proposal = await ai.createBookProposal(args)
    
    // Step 2: Generate table of contents based on proposal
    const toc = await ai.createTableOfContents({ proposal })
    
    // Step 3: Create detailed outlines for each chapter
    const chapterOutlines = await Promise.all(toc.chapters.map(async (chapter, idx) => {
      return ai.createChapterOutline({
        bookTitle: proposal.title,
        chapterNumber: (idx + 1).toString(),
        chapterTitle: chapter.title
      })
    }))
    
    // Step 4: Write all sections for each chapter
    const completedChapters = await Promise.all(chapterOutlines.map(async (outline, idx) => {
      const chapterNumber = idx + 1
      
      // Write each section in parallel for efficiency
      const sections = await Promise.all(outline.sections.map(async (section) => {
        return ai.writeSection({
          bookTitle: proposal.title,
          chapterNumber: chapterNumber.toString(),
          chapterTitle: outline.chapterTitle,
          sectionTitle: section.title
        })
      }))
      
      return {
        chapterNumber,
        chapterTitle: outline.chapterTitle,
        sections
      }
    }))
    
    // Step 5: Review each chapter for quality and consistency
    const chapterReviews = await Promise.all(completedChapters.map(async (chapter) => {
      return ai.reviewChapter({
        bookTitle: proposal.title,
        chapterNumber: chapter.chapterNumber.toString(),
        chapterTitle: chapter.chapterTitle
      })
    }))
    
    // Step 6: Perform comprehensive book review
    const bookReview = await ai.reviewBook({ bookTitle: proposal.title })
    
    // Step 7: Edit book based on review feedback
    const bookEdits = await ai.editBook({ bookTitle: proposal.title })
    
    // Step 8: Prepare final materials for publication
    const publicationPrep = await ai.prepareForPublication({ bookTitle: proposal.title })
    
    // Return complete book package with all components
    return {
      proposal,
      tableOfContents: toc,
      chapterOutlines,
      completedChapters,
      chapterReviews,
      bookReview,
      bookEdits,
      publicationPrep
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
    summary: 'one paragraph summary of the book concept'
  },
  
  // Table of Contents - Structure of the book
  createTableOfContents: {
    bookTitle: 'title of the book',
    introduction: 'brief description of the introduction',
    chapters: [{
      title: 'chapter title',
      summary: 'brief summary of the chapter content',
      sections: [{
        title: 'section title',
        summary: 'brief description of the section content'
      }],
      estimatedPages: 'estimated number of pages for this chapter'
    }],
    conclusion: 'brief description of the conclusion',
    appendices: ['list of potential appendices if applicable'],
    bibliography: 'description of reference sources if applicable',
    estimatedTotalPages: 'estimated total page count for the book'
  },
  
  // Chapter Outline - Detailed plan for a specific chapter
  createChapterOutline: {
    bookTitle: 'title of the book',
    chapterNumber: 'number of the chapter',
    chapterTitle: 'title of the chapter',
    openingHook: 'engaging opening to capture reader interest',
    keyPoints: ['main points to be covered in the chapter'],
    sections: [{
      title: 'section title',
      content: 'detailed description of section content',
      keyIdeas: ['key ideas to be conveyed in this section'],
      examples: ['examples or case studies to include'],
      transitions: 'how this section connects to the next'
    }],
    conclusion: 'how the chapter will wrap up',
    exercises: ['potential exercises or reflection questions for readers'],
    references: ['key references or citations for this chapter'],
    visualElements: ['diagrams, charts, or illustrations to include']
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
    wordCount: 'word count for this section'
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
    nextStepsRecommendation: 'recommended next steps for improvement'
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
    finalRecommendations: ['prioritized list of final recommendations']
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
    transitionImprovements: 'ways to improve transitions between sections'
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
    distributionChannels: ['recommended distribution channels']
  },


})

// Example book to work with
const bookExample = {
  title: 'The Startup Mindset',
  author: 'Nathan Clevenger'
}

// Function to run the entire book creation process
const writeCompleteBook = async () => {
  console.log('Starting book creation process...')
  
  // Step 1: Create book proposal
  console.log('\n1. Creating book proposal...')
  const proposal = await ai.createBookProposal({
    title: bookExample.title,
    author: bookExample.author
  })
  console.log('Book proposal created:', proposal)
  
  // Step 2: Create table of contents
  console.log('\n2. Creating table of contents...')
  const toc = await ai.createTableOfContents({
    bookTitle: proposal.title
  })
  console.log('Table of contents created:', toc)
  
  // Step 3: Create chapter outlines for each chapter
  console.log('\n3. Creating chapter outlines...')
  const chapterOutlines = []
  for (let i = 0; i < toc.chapters.length; i++) {
    const chapterNumber = i + 1
    const chapterTitle = toc.chapters[i].title
    console.log(`Creating outline for Chapter ${chapterNumber}: ${chapterTitle}...`)
    
    const chapterOutline = await ai.createChapterOutline({
      bookTitle: proposal.title,
      chapterNumber: chapterNumber.toString(),
      chapterTitle
    })
    
    chapterOutlines.push(chapterOutline)
    console.log(`Outline for Chapter ${chapterNumber} created`)
  }
  
  // Step 4: Write each section of each chapter
  console.log('\n4. Writing chapter sections...')
  const completedChapters = []
  
  for (let i = 0; i < chapterOutlines.length; i++) {
    const chapterNumber = i + 1
    const chapterOutline = chapterOutlines[i]
    const chapterSections = []
    
    console.log(`Writing sections for Chapter ${chapterNumber}: ${chapterOutline.chapterTitle}...`)
    
    for (let j = 0; j < chapterOutline.sections.length; j++) {
      const sectionTitle = chapterOutline.sections[j].title
      console.log(`Writing section: ${sectionTitle}...`)
      
      const section = await ai.writeSection({
        bookTitle: proposal.title,
        chapterNumber: chapterNumber.toString(),
        chapterTitle: chapterOutline.chapterTitle,
        sectionTitle
      })
      
      chapterSections.push(section)
      console.log(`Section "${sectionTitle}" completed`)
    }
    
    completedChapters.push({
      chapterNumber,
      chapterTitle: chapterOutline.chapterTitle,
      sections: chapterSections
    })
  }
  
  // Step 5: Review each chapter
  console.log('\n5. Reviewing chapters...')
  const chapterReviews = []
  
  for (let i = 0; i < completedChapters.length; i++) {
    const chapter = completedChapters[i]
    console.log(`Reviewing Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}...`)
    
    const review = await ai.reviewChapter({
      bookTitle: proposal.title,
      chapterNumber: chapter.chapterNumber.toString(),
      chapterTitle: chapter.chapterTitle
    })
    
    chapterReviews.push(review)
    console.log(`Review for Chapter ${chapter.chapterNumber} completed`)
  }
  
  // Step 6: Complete book review
  console.log('\n6. Conducting full book review...')
  const bookReview = await ai.reviewBook({
    bookTitle: proposal.title
  })
  console.log('Book review completed:', bookReview)
  
  // Step 7: Edit the book based on reviews
  console.log('\n7. Editing book based on reviews...')
  const bookEdits = await ai.editBook({
    bookTitle: proposal.title
  })
  console.log('Book edits completed:', bookEdits)
  
  // Step 8: Prepare for publication
  console.log('\n8. Preparing book for publication...')
  const publicationPrep = await ai.prepareForPublication({
    bookTitle: proposal.title
  })
  console.log('Publication preparation completed:', publicationPrep)
  
  console.log('\nBook creation process completed!')
  return {
    proposal,
    tableOfContents: toc,
    chapterOutlines,
    completedChapters,
    chapterReviews,
    bookReview,
    bookEdits,
    publicationPrep
  }
}

