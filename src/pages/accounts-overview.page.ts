import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AccountsOverviewLocators } from '../locators/accounts-overview.locators';

export class AccountsOverviewPage extends BasePage {
  readonly locators: AccountsOverviewLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new AccountsOverviewLocators(page);
  }

  async open(): Promise<void> {
    await this.click(this.locators.accountsOverviewLink);
    await this.verifyUrl(/overview\.htm/, 15_000);
  }

  async verifyDefaultAccountCreated(): Promise<void> {
    await this.verifyVisible(this.locators.defaultAccountRow, 15_000);
  }

  async getDefaultAccountBalance(): Promise<string> {
    return await this.getText(this.locators.defaultAccountBalance);
  }

  async getAccountIds(): Promise<string[]> {
    return this.page.locator('#accountTable tbody tr').locator('td:first-child a').evaluateAll((links) =>
      links
        .map((link) => (link as HTMLAnchorElement).textContent?.trim())
        .filter((id): id is string => Boolean(id))
    );
  }

  async getAccountBalance(accountId: string): Promise<string> {
    const row = this.page.locator('#accountTable tbody tr', {
      has: this.page.getByRole('link', { name: accountId, exact: true })
    });
    return this.getText(row.locator('td').nth(1));
  }

  async getTotalBalance(): Promise<string> {
    return this.getText(this.page.locator('#accountTable tfoot td').last());
  }

  async openAccountDetails(accountId: string): Promise<void> {
    await this.page.getByRole('link', { name: accountId, exact: true }).click();
    await this.verifyUrl(/activity\.htm/, 15_000);
    await expect(this.page.locator('#accountId')).toHaveText(accountId, {
      timeout: 15_000
    });
  }
}