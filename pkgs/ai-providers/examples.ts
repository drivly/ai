import { models } from './src';
import { generateText } from 'ai';

// Example 1: Using with Vercel AI SDK
async function example1() {
  const model = models('gpt-4.5-preview');
  const result = await generateText({ 
    model, 
    prompt: 'Write a blog post about the future of work'
  });
  
  console.log(result.text);
}

// Example 2: Using different providers
async function example2() {
  // This will be routed to Anthropic
  const claudeModel = models('claude-3-opus');
  const claudeResult = await generateText({
    model: claudeModel,
    prompt: 'Write a blog post about the future of work'
  });
  
  console.log('Claude result:', claudeResult.text);
  
  // This will be routed to Google
  const geminiModel = models('gemini-pro');
  const geminiResult = await generateText({
    model: geminiModel,
    prompt: 'Write a blog post about the future of work'
  });
  
  console.log('Gemini result:', geminiResult.text);
}

// Example 3: Using with messages
async function example3() {
  const model = models('gpt-4.5-preview');
  const result = await generateText({
    model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Write a blog post about the future of work' }
    ]
  });
  
  console.log(result.text);
}
