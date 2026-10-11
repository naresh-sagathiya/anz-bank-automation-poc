import { Page } from '@playwright/test';
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

  async openTransactionSearch(): Promise<void> {
    if (!/findtrans\.htm/i.test(this.page.url())) {
      await this.click(this.locators.findTransactionsLink);
      await this.verifyUrl(/findtrans\.htm/, 15_000);
    }
  }

  async searchByTransactionId(transactionId: string): Promise<void> {
    await this.openTransactionSearch();
    await this.fill(this.locators.transactionId, transactionId);
    await this.click(this.locators.findByIdButton);
    await this.page.waitForLoadState('networkidle');
  }

  async searchByDate(date: string): Promise<void> {
    await this.openTransactionSearch();
    await this.fill(this.locators.transactionDate, date);
    await this.click(this.locators.findByDateButton);
    await this.page.waitForLoadState('networkidle');
  }

  async searchByDateRange(fromDate: string, toDate: string): Promise<void> {
    await this.openTransactionSearch();
    await this.fill(this.locators.fromDate, fromDate);
    await this.fill(this.locators.toDate, toDate);
    await this.click(this.locators.findByDateRangeButton);
    await this.page.waitForLoadState('networkidle');
  }

  async searchByAmount(amount: string): Promise<void> {
    await this.openTransactionSearch();
    await this.fill(this.locators.amount, amount);
    await this.click(this.locators.findByAmountButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionEntries(): Promise<ActivityEntry[]> {
    const table = this.page.locator('#transactionTable');
    if (!(await table.isVisible())) return [];

    return this.locators.transactionRows.evaluateAll((rows) =>
      rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('td')).map((cell) =>
          (cell.textContent ?? '').trim()
        );
        const transactionLink = row.querySelector('a');
        const transactionHref = transactionLink?.getAttribute('href') ?? '';
        const transactionId = new URL(
          transactionHref,
          window.location.href
        ).searchParams.get('id');
        return {
          date: cells[0] ?? '',
          description: cells[1] ?? '',
          debit: cells[2] ?? '',
          credit: cells[3] ?? '',
          transactionId: transactionId ?? transactionLink?.textContent?.trim()
        };
      })
    );
  }

  async hasNoResults(): Promise<boolean> {
    return (await this.locators.transactionRows.count()) === 0;
  }
}
