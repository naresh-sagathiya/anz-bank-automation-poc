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
    sourceAccountId?: string
  ): Promise<void> {
    await this.fill(this.locators.amount, amount);
    await this.fill(this.locators.downPayment, downPayment);
    const accountId = sourceAccountId || (await this.getSourceAccountId());
    await this.selectOption(this.locators.fromAccount, accountId);
    await this.click(this.locators.applyButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getSourceAccountId(): Promise<string> {
    const accountId = await this.locators.fromAccount.inputValue();
    if (accountId) {
      return accountId;
    }

    const firstAccount = this.locators.fromAccount.locator(
      'option[value]:not([value=""])'
    );
    const fallbackAccountId = await firstAccount.first().getAttribute('value');
    if (!fallbackAccountId) {
      throw new Error('No source account is available for the loan request.');
    }
    return fallbackAccountId;
  }

  async getResponse(): Promise<string> {
    return (await this.page.locator('#rightPanel').innerText()).trim();
  }

  async getLoanAccountId(): Promise<string> {
    if (!(await this.locators.loanAccountId.isVisible())) {
      return '';
    }
    return this.getText(this.locators.loanAccountId);
  }
}
