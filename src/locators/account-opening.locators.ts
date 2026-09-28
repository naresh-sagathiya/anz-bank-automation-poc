import { Locator, Page } from '@playwright/test';

export class AccountOpeningLocators {
  readonly openNewAccountLink: Locator;
  readonly accountType: Locator;
  readonly fromAccount: Locator;
  readonly openAccountButton: Locator;
  readonly accountOpenedMessage: Locator;
  readonly newAccountId: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.openNewAccountLink = page.getByRole('link', {
      name: 'Open New Account'
    });
    this.accountType = page.locator('#type');
    this.fromAccount = page.locator('#fromAccountId');
    this.openAccountButton = page.getByRole('button', { name: 'Open New Account' })
    this.accountOpenedMessage = page.locator(
      'h1.title:visible',
      { hasText: 'Account Opened!' }
    );
    this.newAccountId = page.locator('#newAccountId');
    this.errorMessage = page.locator('#rightPanel p.error');
  }
}