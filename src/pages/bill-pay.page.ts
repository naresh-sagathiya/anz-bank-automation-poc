import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { BillPayLocators } from '../locators/bill-pay.locators';

export type BillPaymentDetails = {
  payeeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  account: string;
  verifyAccount: string;
  amount: string;
};

export class BillPayPage extends BasePage {
  readonly locators: BillPayLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new BillPayLocators(page);
  }

  async open(): Promise<void> {
    await this.click(this.locators.billPayLink);
    await this.verifyUrl(/billpay\.htm/, 15_000);
  }

  async fillPayment(details: BillPaymentDetails): Promise<void> {
    await this.fill(this.locators.payeeName, details.payeeName);
    await this.fill(this.locators.payeeAddress, details.address);
    await this.fill(this.locators.payeeCity, details.city);
    await this.fill(this.locators.payeeState, details.state);
    await this.fill(this.locators.payeeZipCode, details.zipCode);
    await this.fill(this.locators.payeePhone, details.phone);
    await this.fill(this.locators.payeeAccount, details.account);
    await this.fill(this.locators.verifyAccount, details.verifyAccount);
    await this.fill(this.locators.amount, details.amount);
  }

  async submitPayment(sourceAccountId: string): Promise<void> {
    await this.selectOption(this.locators.fromAccount, sourceAccountId);
    await this.click(this.locators.sendPaymentButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getResponse(): Promise<string> {
    return ((await this.page.locator('body').textContent()) ?? '').trim();
  }
}
