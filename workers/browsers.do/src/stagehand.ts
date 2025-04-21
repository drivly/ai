import { Stagehand } from '@browserbasehq/stagehand';
import { BrowserBase } from './browser-base';

// Import Browserbase SDK
import { Browserbase } from '@browserbasehq/sdk';

/**
 * StagehandBrowser implementation of BrowserBase interface
 * using Stagehand and Browserbase SDK
 */
export class StagehandBrowser implements BrowserBase {
  private stagehand: Stagehand | null = null;
  private options: Record<string, any>;
  private sessionId?: string;

  constructor(options: Record<string, any> = {}) {
    this.options = options;
  }

  async launch(options: Record<string, any> = {}): Promise<void> {
    if (!this.sessionId && !options.sessionId) {
      const browserbase = new Browserbase({
        apiKey: this.options.apiKey || process.env.BROWSERBASE_API_KEY,
      });
      // Use type assertion to bypass TypeScript errors with the Browserbase SDK
      const session = await (browserbase as any).sessions.create({
        projectId: this.options.projectId || process.env.BROWSERBASE_PROJECT_ID!,
      });
      this.sessionId = session.id;
    } else if (options.sessionId) {
      this.sessionId = options.sessionId;
    }

    this.stagehand = new Stagehand({
      env: 'BROWSERBASE',
      apiKey: this.options.apiKey || process.env.BROWSERBASE_API_KEY,
      projectId: this.options.projectId || process.env.BROWSERBASE_PROJECT_ID,
      browserbaseSessionID: this.sessionId,
      verbose: this.options.verbose || 1
    });

    await this.stagehand.init();
  }

  async navigate(url: string): Promise<void> {
    if (!this.stagehand) throw new Error('Browser not launched');
    await this.stagehand.page.goto(url);
  }

  async waitForSelector(selector: string): Promise<void> {
    if (!this.stagehand) throw new Error('Browser not launched');
    await this.stagehand.page.waitForSelector(selector);
  }

  async waitForNavigation(): Promise<void> {
    if (!this.stagehand) throw new Error('Browser not launched');
    await this.stagehand.page.waitForNavigation();
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.stagehand) throw new Error('Browser not launched');
    await this.stagehand.page.fill(selector, text);
  }

  async click(selector: string): Promise<void> {
    if (!this.stagehand) throw new Error('Browser not launched');
    await this.stagehand.page.click(selector);
  }

  async press(key: string): Promise<void> {
    if (!this.stagehand) throw new Error('Browser not launched');
    await this.stagehand.page.keyboard.press(key);
  }

  async getCurrentUrl(): Promise<string> {
    if (!this.stagehand) throw new Error('Browser not launched');
    return this.stagehand.page.url();
  }

  async evaluate<T>(fn: () => T): Promise<T> {
    if (!this.stagehand) throw new Error('Browser not launched');
    return this.stagehand.page.evaluate(fn);
  }

  async close(): Promise<void> {
    if (this.stagehand) {
      await this.stagehand.close();
      this.stagehand = null;
    }
  }

  async getSessionInfo(): Promise<{ sessionId: string; debugUrl?: string }> {
    if (!this.sessionId) throw new Error('No active session');
    
    const browserbase = new Browserbase({
      apiKey: this.options.apiKey || process.env.BROWSERBASE_API_KEY,
    });
    // Use type assertion to bypass TypeScript errors with the Browserbase SDK
    const debugInfo = await (browserbase as any).sessions.debug(this.sessionId);
    
    return {
      sessionId: this.sessionId,
      debugUrl: debugInfo.debuggerFullscreenUrl,
    };
  }
}
