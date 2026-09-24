import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoanLocators } from '../locators/loan.locators';

export class LoanPage extends BasePage {
  readonly locators: LoanLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoanLocators(page);
  }

  async open(): Promise<void> {
    await this.click(this.locators.requestLoanLink);
    await this.verifyUrl(/requestloan\.htm/, 15_000);
  }

  async apply(
    amount: string,
    downPayment: string,
    sourceAccountId: string
  ): Promise<void> {
    await this.fill(this.locators.amount, amount);
    await this.fill(this.locators.downPayment, downPayment);
    await this.selectOption(this.locators.fromAccount, sourceAccountId);
    await this.click(this.locators.applyButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getResponse(): Promise<string> {
    return ((await this.page.locator('body').textContent()) ?? '').trim();
  }

  async getLoanAccountId(): Promise<string> {
    return this.getText(this.locators.loanAccountId);
  }
}
