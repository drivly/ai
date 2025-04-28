/**
 * BrowserBase interface for browser automation
 * Based on the interface used in LinkedIn automation
 */
export interface BrowserBase {
  launch(options?: Record<string, any>): Promise<void>
  navigate(url: string): Promise<void>
  waitForSelector(selector: string): Promise<void>
  waitForNavigation(): Promise<void>
  type(selector: string, text: string): Promise<void>
  click(selector: string): Promise<void>
  press(key: string): Promise<void>
  getCurrentUrl(): Promise<string>
  evaluate<T>(fn: () => T): Promise<T>
  close(): Promise<void>
}
