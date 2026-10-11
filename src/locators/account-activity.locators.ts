import { Locator, Page } from '@playwright/test';

export class AccountActivityLocators {
  readonly findTransactionsLink: Locator;
  readonly transactionId: Locator;
  readonly transactionDate: Locator;
  readonly fromDate: Locator;
  readonly toDate: Locator;
  readonly amount: Locator;
  readonly findByIdButton: Locator;
  readonly findByDateButton: Locator;
  readonly findByDateRangeButton: Locator;
  readonly findByAmountButton: Locator;
  readonly transactionRows: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.findTransactionsLink = page.getByRole('link', {
      name: 'Find Transactions',
      exact: true
    });
    this.transactionId = page.locator('#transactionId');
    this.transactionDate = page.locator('#transactionDate');
    this.fromDate = page.locator('#fromDate');
    this.toDate = page.locator('#toDate');
    this.amount = page.locator('#amount');
    this.findByIdButton = page.locator('#findById');
    this.findByDateButton = page.locator('#findByDate');
    this.findByDateRangeButton = page.locator('#findByDateRange');
    this.findByAmountButton = page.locator('#findByAmount');
    this.transactionRows = page.locator('#transactionTable tbody tr');
    this.noResultsMessage = page.locator('#noTransactionsMessage');
  }
}
