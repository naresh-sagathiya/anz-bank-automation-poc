import { Locator, Page } from '@playwright/test';

export class LoanLocators {
  readonly requestLoanLink: Locator;
  readonly amount: Locator;
  readonly downPayment: Locator;
  readonly fromAccount: Locator;
  readonly applyButton: Locator;
  readonly loanStatus: Locator;
  readonly loanAccountId: Locator;

  constructor(page: Page) {
    this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });
    this.amount = page.locator('#amount');
    this.downPayment = page.locator('#downPayment');
    this.fromAccount = page.locator('#fromAccountId');
    this.applyButton = page
      .getByRole('button', { name: /apply now/i })
      .or(page.locator('input[type="submit"][value="Apply Now"]'));
    this.loanStatus = page.locator('#loanStatus');
    this.loanAccountId = page.locator('#accountNumber');
  }
}
