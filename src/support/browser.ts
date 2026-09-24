import { chromium, firefox, webkit, Browser, BrowserType } from '@playwright/test';
import { config } from './config';

const browserTypes: Record<string, BrowserType> = { chromium, firefox, webkit };

export async function launchBrowser(): Promise<Browser> {
  const browserType = browserTypes[config.browser];
  if (!browserType) {
    throw new Error(`Unsupported browser: ${config.browser}`);
  }

  return browserType.launch({ headless: config.headless });
}
