import { Locator, Page } from '@playwright/test';

export class BillPayLocators {
  readonly billPayLink: Locator;
  readonly payeeName: Locator;
  readonly payeeAddress: Locator;
  readonly payeeCity: Locator;
  readonly payeeState: Locator;
  readonly payeeZipCode: Locator;
  readonly payeePhone: Locator;
  readonly payeeAccount: Locator;
  readonly verifyAccount: Locator;
  readonly amount: Locator;
  readonly fromAccount: Locator;
  readonly sendPaymentButton: Locator;

  constructor(page: Page) {
    this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
    this.payeeName = page.locator('#payeeName');
    this.payeeAddress = page.locator('#payeeAddress');
    this.payeeCity = page.locator('#payeeCity');
    this.payeeState = page.locator('#payeeState');
    this.payeeZipCode = page.locator('#payeeZipCode');
    this.payeePhone = page.locator('#payeePhone');
    this.payeeAccount = page.locator('#payeeAccount');
    this.verifyAccount = page.locator('#verifyAccount');
    this.amount = page.locator('#amount');
    this.fromAccount = page.locator('#fromAccountId');
    this.sendPaymentButton = page
      .getByRole('button', { name: /send payment/i })
      .or(page.locator('input[type="submit"][value="Send Payment"]'));
  }
}
