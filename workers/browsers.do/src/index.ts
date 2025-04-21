import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { StagehandBrowser } from './stagehand';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

interface Env {
  BROWSERBASE_API_KEY?: string;
  BROWSERBASE_PROJECT_ID?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

const sessions: Record<string, StagehandBrowser> = {};

const createSessionSchema = z.object({
  options: z.record(z.any()).optional(),
});

app.post('/session', zValidator('json', createSessionSchema), async (c) => {
  const { options = {} } = c.req.valid('json');
  
  const browser = new StagehandBrowser({
    apiKey: c.env.BROWSERBASE_API_KEY,
    projectId: c.env.BROWSERBASE_PROJECT_ID,
    ...options,
  });
  
  await browser.launch();
  
  const sessionInfo = await browser.getSessionInfo();
  
  sessions[sessionInfo.sessionId] = browser;
  
  return c.json(sessionInfo);
});

const actionSchema = z.object({
  action: z.enum(['navigate', 'waitForSelector', 'waitForNavigation', 'type', 'click', 'press', 'getCurrentUrl', 'evaluate', 'close']),
  params: z.array(z.any()).optional(),
});

app.post('/session/:sessionId/action', zValidator('json', actionSchema), async (c) => {
  const sessionId = c.req.param('sessionId');
  const { action, params = [] } = c.req.valid('json');
  
  const browser = sessions[sessionId];
  if (!browser) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  try {
    const result = await (browser as any)[action](...params);
    
    return c.json({ result });
  } catch (error: any) {
    return c.json({ error: error.message || 'Unknown error' }, 500);
  }
});

app.get('/session/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  
  const browser = sessions[sessionId];
  if (!browser) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  try {
    const sessionInfo = await browser.getSessionInfo();
    return c.json(sessionInfo);
  } catch (error: any) {
    return c.json({ error: error.message || 'Unknown error' }, 500);
  }
});

app.delete('/session/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  
  const browser = sessions[sessionId];
  if (!browser) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  try {
    await browser.close();
    delete sessions[sessionId];
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message || 'Unknown error' }, 500);
  }
});

export default {
  fetch: app.fetch,
};
