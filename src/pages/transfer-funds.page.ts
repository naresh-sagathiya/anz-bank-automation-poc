import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TransferFundsLocators } from '../locators/transfer-funds.locators';

export class TransferFundsPage extends BasePage {
  readonly locators: TransferFundsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new TransferFundsLocators(page);
  }

  async open(): Promise<void> {
    await this.click(this.locators.transferFundsLink);
    await this.verifyUrl(/transfer\.htm/, 15_000);
  }

  async transfer(
    amount: string,
    sourceAccountId: string,
    destinationAccountId: string
  ): Promise<void> {
    await this.fill(this.locators.amount, amount);
    await this.selectOption(this.locators.fromAccount, sourceAccountId);
    await this.selectOption(this.locators.toAccount, destinationAccountId);
    await this.click(this.locators.transferButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTransferResponse(): Promise<string> {
    return ((await this.page.locator('body').textContent()) ?? '').trim();
  }
}
