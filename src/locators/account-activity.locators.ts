import { Locator, Page } from '@playwright/test';

export class AccountActivityLocators {
  readonly transactionId: Locator;
  readonly fromDate: Locator;
  readonly toDate: Locator;
  readonly amount: Locator;
  readonly findTransactionsButton: Locator;
  readonly transactionRows: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.transactionId = page.locator('#transactionId');
    this.fromDate = page.locator('#fromDate');
    this.toDate = page.locator('#toDate');
    this.amount = page.locator('#amount');
    this.findTransactionsButton = page
      .getByRole('button', { name: /find transactions/i })
      .or(page.locator('input[type="submit"][value="Find Transactions"]'));
    this.transactionRows = page.locator('#transactionTable tbody tr');
    this.noResultsMessage = page.locator('#noTransactionsMessage');
  }
}
