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
  readonly paymentCompleteMessage: Locator;

  constructor(page: Page) {
    this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
    this.payeeName = page.locator('input[name="payee.name"]');
    this.payeeAddress = page.locator('input[name="payee.address.street"]');
    this.payeeCity = page.locator('input[name="payee.address.city"]');
    this.payeeState = page.locator('input[name="payee.address.state"]');
    this.payeeZipCode = page.locator('input[name="payee.address.zipCode"]');
    this.payeePhone = page.locator('input[name="payee.phoneNumber"]');
    this.payeeAccount = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccount = page.locator('input[name="verifyAccount"]');
    this.amount = page.locator('input[name="amount"]');
    this.fromAccount = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page
      .getByRole('button', { name: /send payment/i })
      .or(page.locator('input[type="submit"][value="Send Payment"]'));
    this.paymentCompleteMessage = page.locator('#billpayResult');
  }
}
