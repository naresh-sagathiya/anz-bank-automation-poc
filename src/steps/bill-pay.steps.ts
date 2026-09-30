import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import testData from '../data/test-data.json';
import { BillPaymentDetails } from '../pages/bill-pay.page';
import { CustomWorld } from '../support/world';

const parseMoney = (value: string): number =>
  Number(value.replace(/[$,]/g, '').trim());

const billPayData = (): BillPaymentDetails => ({
  payeeName: testData.billPay.payeeName,
  address: testData.billPay.address,
  city: testData.billPay.city,
  state: testData.billPay.state,
  zipCode: testData.billPay.zipCode,
  phone: testData.billPay.phone,
  account: testData.billPay.account,
  verifyAccount: testData.billPay.verifyAccount,
  amount: testData.billPay.amount
});

async function readBillPayActivity(world: CustomWorld): Promise<void> {
  await world.accountsOverviewPage.open();
  await world.accountsOverviewPage.openAccountDetails(world.sourceAccountId!);
  world.billPayActivityEntries =
    await world.accountActivityPage.getTransferEntries();
}

async function submitBillPayment(
  world: CustomWorld,
  details: BillPaymentDetails
): Promise<void> {
  await world.billPayPage.open();
  await world.billPayPage.fillPayment(details);
  await world.billPayPage.submitPayment(world.sourceAccountId!);
  world.billPayConfirmationVisible =
    await world.billPayPage.isPaymentCompleteVisible();
  if (world.billPayConfirmationVisible) {
    world.billPayCompletedPayments += 1;
  }
  world.billPayFormVisible = await world.billPayPage.isPaymentFormVisible();
  world.billPaySubmittedAmount = details.amount;
  world.billPayDisplayedAmount = await world.billPayPage.getDisplayedAmount();
  world.billPayResultText = world.billPayConfirmationVisible
    ? await world.billPayPage.getPaymentResultText()
    : undefined;
}

When(
  'the customer prepares to pay a bill',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountsOverviewPage.open();
    this.sourceAccountId = (await this.accountsOverviewPage.getAccountIds())[0];
    this.billPaySourceBalanceBefore = parseMoney(
      await this.accountsOverviewPage.getAccountBalance(this.sourceAccountId)
    );
  }
);

When(
  'the customer pays the bill using valid payee information',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await submitBillPayment(this, billPayData());
    this.billPayAmount = parseMoney(testData.billPay.amount);
    await readBillPayActivity(this);
  }
);

When(
  'the customer pays the bill with the {string} field blank',
  { timeout: 30_000 },
  async function (this: CustomWorld, field: string) {
    const details = billPayData();
    const fieldMap: Record<string, keyof BillPaymentDetails> = {
      'payee name': 'payeeName',
      address: 'address',
      city: 'city',
      state: 'state',
      'ZIP code': 'zipCode',
      'phone number': 'phone',
      'account number': 'account',
      'verify-account number': 'verifyAccount'
    };
    const key = fieldMap[field];
    if (!key) throw new Error(`Unsupported bill-pay field: ${field}`);
    details[key] = '';
    await submitBillPayment(this, details);
  }
);

When(
  'the customer pays the bill with a blank amount',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    const details = billPayData();
    details.amount = '';
    await submitBillPayment(this, details);
  }
);

When(
  'the customer pays the bill with amount {string}',
  { timeout: 30_000 },
  async function (this: CustomWorld, amount: string) {
    const details = billPayData();
    details.amount = amount;
    await submitBillPayment(this, details);
    this.billPayAmount = parseMoney(amount);
  }
);

When(
  'the customer pays the bill with an amount greater than the source balance',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    const details = billPayData();
    details.amount = (this.billPaySourceBalanceBefore! + 1).toFixed(2);
    await submitBillPayment(this, details);
  }
);

When(
  'the customer pays the bill with mismatched account numbers',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    const details = billPayData();
    details.verifyAccount = `${details.account}1`;
    await submitBillPayment(this, details);
  }
);

When(
  'the customer pays the same bill twice with amount {string}',
  { timeout: 45_000 },
  async function (this: CustomWorld, amount: string) {
    const details = billPayData();
    details.amount = amount;
    await submitBillPayment(this, details);
    await submitBillPayment(this, details);
    this.billPayAmount = parseMoney(amount);
  }
);

Then(
  'the bill-payment confirmation should be displayed',
  { timeout: 30_000 },
  function (this: CustomWorld) {
    expect(this.billPayConfirmationVisible).toBe(true);
  }
);

Then(
  'the bill-payment source account should be debited',
  async function (this: CustomWorld) {
    const before = this.billPaySourceBalanceBefore!;
    await this.accountsOverviewPage.open();
    const after = parseMoney(
      await this.accountsOverviewPage.getAccountBalance(this.sourceAccountId!)
    );
    expect(before - after).toBe(this.billPayAmount);
  }
);

Then('the bill payment should be rejected', function (this: CustomWorld) {
  expect(this.billPayConfirmationVisible).toBe(false);
});

Then(
  'the bill-pay outcome should match the submitted amount',
  function (this: CustomWorld) {
    if (this.billPayConfirmationVisible) {
      expect(this.billPayResultText).toContain(
        `$${Number(this.billPaySubmittedAmount).toFixed(2)}`
      );
      return;
    }

    expect(this.billPayFormVisible).toBe(true);
    expect(this.billPayDisplayedAmount).toBe(this.billPaySubmittedAmount);
  }
);

Then(
  'the source-account debits should match completed bill payments',
  async function (this: CustomWorld) {
    const before = this.billPaySourceBalanceBefore!;
    await this.accountsOverviewPage.open();
    const after = parseMoney(
      await this.accountsOverviewPage.getAccountBalance(this.sourceAccountId!)
    );
    const debit = before - after;
    expect(this.billPayCompletedPayments).toBeGreaterThan(0);
    expect(debit).toBe(
      this.billPayAmount! * this.billPayCompletedPayments
    );
    await this.attach(
      `Two submissions; ${this.billPayCompletedPayments} completed; total debit $${debit.toFixed(2)}.`
    );
  }
);
