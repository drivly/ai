import { AI } from 'workflows.do'

export default AI({
  createYoutubeVideo: async (event, { ai, api, db }) => {
    const { topic, audience, keywords } = event
    
    const videoStrategy = await ai.createVideoStrategy({ topic, audience, keywords })
    
    const script = await ai.writeVideoScript({
      topic,
      outline: videoStrategy.outline,
      tone: videoStrategy.tone,
      duration: videoStrategy.duration
    })
    
    const visualAssets = await api.videoGeneration.createVisuals({
      script,
      style: 'corporate',
      transitions: true
    })
    
    const voiceover = await api.speech.generateVoiceover({
      script: script.narration,
      voice: 'professional-male-1'
    })
    
    const videoFile = await api.videoGeneration.renderVideo({
      visuals: visualAssets,
      audio: voiceover,
      outputFormat: 'mp4'
    })
    
    const metadata = await ai.createYoutubeMetadata({
      title: script.title,
      content: script.content,
      keywords
    })
    
    const publishedVideo = await api.youtube.uploadVideo({
      videoFile,
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      category: metadata.category
    })
    
    await api.analytics.trackPublishing({
      platform: 'youtube',
      videoId: publishedVideo.id,
      metadata
    })
    
    return {
      videoId: publishedVideo.id,
      url: publishedVideo.url,
      analytics: publishedVideo.analyticsUrl,
      metadata
    }
  }
})
