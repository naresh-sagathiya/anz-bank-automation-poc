/** Shared Playwright actions and assertions used by web page objects. */
import { Locator, Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async click(locator: Locator, noWaitAfter = false): Promise<void> {
    await locator.click({ noWaitAfter });
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  async verifyVisible(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible().catch(() => false);
  }

  async verifyText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async getText(locator: Locator): Promise<string> {
    return ((await locator.textContent()) ?? '').trim();
  }

  async verifyUrl(url: RegExp, timeout?: number): Promise<void> {
    await expect(this.page).toHaveURL(url, { timeout });
  }

  async waitForUrl(url: RegExp): Promise<void> {
    await this.page.waitForURL(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }
}
