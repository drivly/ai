import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { MCPConfiguration } from '@mastra/mcp';
import fs from 'fs';
import path from 'path';
import { handleError, getCredentials, wait } from '../config.js';

const mcp = new MCPConfiguration({
  servers: {
    twitter: {
      url: new URL(process.env.COMPOSIO_TWITTER_URL || 'https://mcp.composio.dev/twitter/'), // URL will be provided by Composio
    },
  },
});

export default class XEngagementAgent {
  constructor(config = {}) {
    this.credentials = config.credentials || getCredentials('X');
    this.processedTweetsPath = path.join(process.cwd(), 'data/processed_tweets.json');
    this.processedTweets = this.loadProcessedTweets();
    this.engagementCriteria = config.engagementCriteria || {
      min_likes: 5,
      min_retweets: 2,
      keywords: ['api', 'sdk', 'developer', 'function', 'serverless', 'cloud'],
      exclude_keywords: ['nsfw', 'controversial', 'political']
    };
  }
  
  /**
   * Initialize the Mastra agent with Composio Twitter tools
   */
  async initialize() {
    const tools = await mcp.getTools();
    
    this.agent = new Agent({
      name: "XEngagementAgent",
      instructions: "You are a social media engagement specialist focused on engaging with relevant content on X (Twitter). Your goal is to increase brand visibility, build industry authority, and generate high-quality leads.",
      model: openai("gpt-4o"),
      tools: tools,
    });
    
    return this;
  }
  
  /**
   * Load the list of processed tweets
   * @returns {Array} Array of processed tweet IDs
   */
  loadProcessedTweets() {
    if (fs.existsSync(this.processedTweetsPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(this.processedTweetsPath, 'utf8'));
        if (!Array.isArray(data)) {
          console.warn('processed_tweets.json is not an array, resetting.');
          return [];
        }
        return data;
      } catch (parseError) {
        console.error('Error parsing processed_tweets.json, resetting:', parseError);
        return [];
      }
    }
    return [];
  }
  
  /**
   * Save the list of processed tweets
   */
  saveProcessedTweets() {
    const dataDir = path.dirname(this.processedTweetsPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(this.processedTweetsPath, JSON.stringify(this.processedTweets, null, 2));
  }
  
  /**
   * Determine if a tweet should be engaged with
   * @param {Object} tweet - Tweet object from Twitter API
   * @param {Object} criteria - Engagement criteria
   * @returns {boolean} True if tweet should be engaged with
   */
  shouldEngageWithTweet(tweet, criteria = this.engagementCriteria) {
    if (!tweet.public_metrics) {
      console.warn(`Tweet ${tweet.id} missing public_metrics.`);
      return false;
    }
  
    const hasEnoughEngagement =
      (tweet.public_metrics.like_count || 0) >= criteria.min_likes ||
      (tweet.public_metrics.retweet_count || 0) >= criteria.min_retweets;
  
    if (!hasEnoughEngagement) {
      return false;
    }
  
    const tweetTextLower = tweet.text.toLowerCase();
    const containsKeyword = criteria.keywords.some(keyword =>
      tweetTextLower.includes(keyword.toLowerCase())
    );
  
    if (!containsKeyword) {
      return false;
    }
  
    const containsExcludedKeyword = criteria.exclude_keywords.some(keyword =>
      tweetTextLower.includes(keyword.toLowerCase())
    );
  
    if (containsExcludedKeyword) {
      return false;
    }
  
    return true; // Passed all checks
  }
  
  /**
   * Find tweets to engage with based on influencers and criteria
   * @param {Array} influencers - List of influencers to monitor
   * @param {Object} criteria - Engagement criteria
   * @returns {Promise<Array>} Tweets to engage with
   */
  async findTweetsToEngage(influencers, criteria = this.engagementCriteria) {
    const tweetsToEngage = [];
    
    try {
      for (const influencer of influencers) {
        console.log(`Fetching tweets for ${influencer.username}...`);
        
        const response = await this.agent.generate({
          messages: [
            {
              role: "user",
              content: `Find the most recent 10 tweets from user ${influencer.username} (${influencer.id}) excluding retweets and replies.`
            }
          ]
        });
        
        const tweets = JSON.parse(response.text);
        
        for (const tweet of tweets) {
          if (this.processedTweets.includes(tweet.id)) {
            console.log(`Skipping already processed tweet ${tweet.id}`);
            continue;
          }
          
          if (this.shouldEngageWithTweet(tweet, criteria)) {
            console.log(`Found potential tweet to engage with: ${tweet.id} by ${influencer.username}`);
            tweetsToEngage.push({
              id: tweet.id,
              text: tweet.text,
              author: influencer.username,
              metrics: tweet.public_metrics,
              topics: influencer.topics,
            });
            
            this.processedTweets.push(tweet.id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching tweets:', error.message || error);
    }
    
    this.saveProcessedTweets();
    return tweetsToEngage;
  }
  
  /**
   * Compose a new tweet
   * @param {string} content - Tweet content
   * @returns {Promise<Object>} Result of the tweet operation
   */
  async composeTweet(content) {
    try {
      const response = await this.agent.generate({
        messages: [
          {
            role: "user",
            content: `Compose a tweet with the following content: ${content}`
          }
        ]
      });
      
      return {
        success: true,
        response: response.text
      };
    } catch (error) {
      return handleError(error, 'XEngagementAgent.composeTweet');
    }
  }
  
  /**
   * Reply to a tweet
   * @param {string} tweetId - ID of the tweet to reply to
   * @param {string} content - Reply content
   * @returns {Promise<Object>} Result of the reply operation
   */
  async replyToTweet(tweetId, content) {
    try {
      const response = await this.agent.generate({
        messages: [
          {
            role: "user",
            content: `Reply to tweet with ID ${tweetId} with the following content: ${content}`
          }
        ]
      });
      
      return {
        success: true,
        response: response.text
      };
    } catch (error) {
      return handleError(error, 'XEngagementAgent.replyToTweet');
    }
  }
  
  /**
   * Like a tweet
   * @param {string} tweetId - ID of the tweet to like
   * @returns {Promise<Object>} Result of the like operation
   */
  async likeTweet(tweetId) {
    try {
      const response = await this.agent.generate({
        messages: [
          {
            role: "user",
            content: `Like tweet with ID ${tweetId}`
          }
        ]
      });
      
      return {
        success: true,
        response: response.text
      };
    } catch (error) {
      return handleError(error, 'XEngagementAgent.likeTweet');
    }
  }
  
  /**
   * Generate responses for tweets using AI
   * @param {Array} tweets - Tweets to respond to
   * @returns {Promise<Array>} Generated responses
   */
  async generateResponses(tweets) {
    const responses = [];
    
    for (const tweet of tweets) {
      try {
        console.log(`Generating response for tweet by ${tweet.author}...`);
        
        const response = await this.agent.generate({
          messages: [
            {
              role: "system",
              content: `You are a social media engagement specialist for a company focused on APIs, SDKs, and developer tools. Your task is to generate a professional, friendly response to a tweet. The response should be relevant to the tweet content, provide value, and reflect the brand voice as helpful, developer-focused, and innovative.`
            },
            {
              role: "user",
              content: `Generate a response to the following tweet by ${tweet.author}:
                
                Tweet: ${tweet.text}
                
                Topics: ${tweet.topics.join(', ')}`
            }
          ]
        });
        
        const result = response.text.trim();
        
        responses.push({
          id: tweet.id,
          tweet: tweet.text,
          author: tweet.author,
          response: result,
        });
        
        await wait(1000);
      } catch (error) {
        console.error(`Error generating response for tweet by ${tweet.author}:`, error);
      }
    }
    
    return responses;
  }
  
  /**
   * Create markdown proposal for engagement
   * @param {Array} responses - Generated responses
   * @returns {string} Markdown content
   */
  createProposalMarkdown(responses) {
    const now = new Date().toISOString();
    let markdown = `# Tweet Engagement Proposals (${now})\n\n`;
    markdown += `Generated by the X Engagement Agent.\n\n`;
    markdown += `Linear Ticket: [GTM-29](https://linear.app/drivly/issue/GTM-29)\n\n`;
  
    if (responses.length === 0) {
      markdown += 'No valid responses could be generated for the identified tweets.\n';
    } else {
      for (const response of responses) {
        markdown += `## @${response.author}\n\n`;
        markdown += `**Original Tweet**: [${response.id}](https://twitter.com/${response.author}/status/${response.id})\n`;
        markdown += `\`\`\`\n${response.tweet}\n\`\`\`\n\n`; // Use code block for tweet text
        markdown += `**Proposed Response**:\n`;
        markdown += `\`\`\`\n${response.response}\n\`\`\`\n\n`; // Use code block for proposed response
  
        const tweetLink = `https://twitter.com/intent/tweet?in_reply_to=${response.id}`; // Text is better added manually
  
        markdown += `**[Review & Post Reply on X](${tweetLink})**\n\n`;
        markdown += `*(Clicking the link will open the X reply interface. You can edit the response there before posting.)*\n\n`;
        markdown += `---\n\n`;
      }
    }
  
    return markdown;
  }
  
  /**
   * Main execution method for the agent
   * @param {Object} input - Input parameters for the agent
   * @returns {Promise<Object>} Result of the agent execution
   */
  async execute(input) {
    try {
      if (!this.agent) {
        await this.initialize();
      }
      
      const { action, params = {} } = input;
      
      switch (action) {
        case 'findTweets':
          const influencersFile = params.influencersFile || path.join(process.cwd(), 'lists/influencers.json');
          const { influencers, engagement_criteria } = JSON.parse(fs.readFileSync(influencersFile, 'utf8'));
          const tweets = await this.findTweetsToEngage(influencers, engagement_criteria || this.engagementCriteria);
          return {
            success: true,
            tweets,
            count: tweets.length,
          };
          
        case 'generateResponses':
          const responses = await this.generateResponses(params.tweets);
          return {
            success: true,
            responses,
            count: responses.length,
          };
          
        case 'createProposal':
          const markdown = this.createProposalMarkdown(params.responses);
          const outputPath = params.outputPath || 'x-tweet-proposals.md';
          fs.writeFileSync(outputPath, markdown);
          return {
            success: true,
            outputPath,
            responseCount: params.responses.length,
          };
          
        case 'composeTweet':
          return await this.composeTweet(params.content);
          
        case 'replyToTweet':
          return await this.replyToTweet(params.tweetId, params.content);
          
        case 'likeTweet':
          return await this.likeTweet(params.tweetId);
          
        case 'runFullWorkflow':
          const findResult = await this.execute({ action: 'findTweets', params: params.findParams || {} });
          
          if (findResult.tweets.length === 0) {
            return {
              success: true,
              message: 'No new tweets to engage with.',
              tweets: [],
              responses: [],
            };
          }
          
          const generateResult = await this.execute({ 
            action: 'generateResponses', 
            params: { tweets: findResult.tweets } 
          });
          
          const proposalResult = await this.execute({ 
            action: 'createProposal', 
            params: { 
              responses: generateResult.responses,
              outputPath: params.outputPath
            } 
          });
          
          return {
            success: true,
            tweetCount: findResult.tweets.length,
            responseCount: generateResult.responses.length,
            proposalPath: proposalResult.outputPath,
          };
          
        default:
          return {
            success: false,
            error: `Unknown action: ${action}`,
          };
      }
    } catch (error) {
      return handleError(error, `XEngagementAgent.execute(${input?.action || 'unknown'})`);
    }
  }
}
