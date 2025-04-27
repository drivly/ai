import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { StagehandBrowser } from './stagehand'

vi.mock('@browserbasehq/stagehand', () => {
  return {
    Stagehand: vi.fn().mockImplementation(() => ({
      init: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      page: {
        goto: vi.fn().mockResolvedValue(undefined),
        waitForSelector: vi.fn().mockResolvedValue(undefined),
        waitForNavigation: vi.fn().mockResolvedValue(undefined),
        fill: vi.fn().mockResolvedValue(undefined),
        click: vi.fn().mockResolvedValue(undefined),
        keyboard: {
          press: vi.fn().mockResolvedValue(undefined),
        },
        url: vi.fn().mockResolvedValue('https://example.com'),
        evaluate: vi.fn().mockImplementation((fn) => Promise.resolve(fn())),
      },
    })),
  }
})

vi.mock('@browserbasehq/sdk', () => {
  return {
    Browserbase: vi.fn().mockImplementation(() => ({
      sessions: {
        create: vi.fn().mockResolvedValue({ id: 'test-session-id' }),
        debug: vi.fn().mockResolvedValue({ debuggerFullscreenUrl: 'https://debug.url' }),
      },
    })),
  }
})

describe('StagehandBrowser', () => {
  let browser: StagehandBrowser

  beforeEach(() => {
    browser = new StagehandBrowser({ projectId: 'test-project' })
  })

  afterEach(async () => {
    await browser.close()
  })

  it('should launch a browser', async () => {
    await browser.launch()
    expect(browser['stagehand']).toBeTruthy()
  })

  it('should navigate to a URL', async () => {
    await browser.launch()
    await browser.navigate('https://example.com')
  })
})
