import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AccountOpeningLocators } from '../locators/account-opening.locators';

export type AccountType = 'CHECKING' | 'SAVINGS';

export class AccountOpeningPage extends BasePage {
  readonly locators: AccountOpeningLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new AccountOpeningLocators(page);
  }

  async open(): Promise<void> {
    await this.click(this.locators.openNewAccountLink);
    await this.verifyUrl(/openaccount\.htm/, 15_000);
  }

  async openAccount(type: AccountType, sourceAccountId?: string): Promise<string> {
    await this.selectOption(this.locators.accountType, type);

    if (sourceAccountId) {
      await this.selectOption(this.locators.fromAccount, sourceAccountId);
    }

    await this.submitOpening();
    await Promise.race([
      this.locators.accountOpenedMessage.waitFor({
        state: 'visible',
        timeout: 15_000
      }),
      this.locators.errorMessage.waitFor({ state: 'visible', timeout: 15_000 })
    ]);

    if (await this.isVisible(this.locators.errorMessage)) {
      throw new Error(
        `Account opening failed: ${await this.getText(this.locators.errorMessage)}`
      );
    }

    return this.getText(this.locators.newAccountId);
  }

  async submitOpening(): Promise<void> {
    await this.click(this.locators.openAccountButton);
  }

  async getSourceAccountId(): Promise<string> {
    return this.locators.fromAccount.inputValue();
  }

  async verifyOpeningError(): Promise<void> {
    await this.verifyVisible(this.locators.errorMessage, 15_000);
  }
}