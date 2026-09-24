import { Locator, Page } from '@playwright/test';

export class TransferFundsLocators {
  readonly transferFundsLink: Locator;
  readonly amount: Locator;
  readonly fromAccount: Locator;
  readonly toAccount: Locator;
  readonly transferButton: Locator;

  constructor(page: Page) {
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
    this.amount = page.locator('#amount');
    this.fromAccount = page.locator('#fromAccountId');
    this.toAccount = page.locator('#toAccountId');
    this.transferButton = page
      .getByRole('button', { name: /transfer/i })
      .or(page.locator('input[type="submit"][value="Transfer"]'));
  }
}
