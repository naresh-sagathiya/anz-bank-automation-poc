import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AccountActivityLocators } from '../locators/account-activity.locators';

export type ActivityEntry = {
  date: string;
  description: string;
  debit: string;
  credit: string;
  transactionId?: string;
};

export class AccountActivityPage extends BasePage {
  readonly locators: AccountActivityLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new AccountActivityLocators(page);
  }

  async getTransferEntries(): Promise<ActivityEntry[]> {
    return this.getTransactionEntries();
  }

  async searchByTransactionId(transactionId: string): Promise<void> {
    await this.fill(this.locators.transactionId, transactionId);
    await this.click(this.locators.findTransactionsButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchByDate(date: string): Promise<void> {
    await this.fill(this.locators.fromDate, date);
    await this.fill(this.locators.toDate, date);
    await this.click(this.locators.findTransactionsButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchByDateRange(fromDate: string, toDate: string): Promise<void> {
    await this.fill(this.locators.fromDate, fromDate);
    await this.fill(this.locators.toDate, toDate);
    await this.click(this.locators.findTransactionsButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchByAmount(amount: string): Promise<void> {
    await this.fill(this.locators.amount, amount);
    await this.click(this.locators.findTransactionsButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTransactionEntries(): Promise<ActivityEntry[]> {
    await expect
      .poll(
        async () =>
          (await this.locators.transactionRows.count()) > 0 ||
          (await this.locators.noResultsMessage.isVisible()),
        { timeout: 15_000 }
      )
      .toBeTruthy();

    return this.locators.transactionRows.evaluateAll((rows) =>
      rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('td')).map((cell) =>
          (cell.textContent ?? '').trim()
        );
        const transactionLink = row.querySelector('a');
        return {
          date: cells[0] ?? '',
          description: cells[1] ?? '',
          debit: cells[2] ?? '',
          credit: cells[3] ?? '',
          transactionId: transactionLink?.textContent?.trim()
        };
      })
    );
  }

  async hasNoResults(): Promise<boolean> {
    return (await this.locators.transactionRows.count()) === 0;
  }
}
