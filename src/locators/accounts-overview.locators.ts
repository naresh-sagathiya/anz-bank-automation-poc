import { Locator, Page } from '@playwright/test';

export class AccountsOverviewLocators {
  readonly accountsOverviewLink: Locator;
  readonly defaultAccountRow: Locator;
  readonly defaultAccountBalance: Locator;

  constructor(page: Page) {
    this.accountsOverviewLink = page.getByRole('link', {
      name: 'Accounts Overview'
    });
    this.defaultAccountRow = page.locator('#accountTable tbody tr').first();
    this.defaultAccountBalance = this.defaultAccountRow.locator('td').nth(1);
  }
}
