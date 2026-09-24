import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { BillPaymentDetails } from '../../pages/bill-pay.page';
import testData from '../../data/test-data.json';

type E2EActivityEntry = {
  date: string;
  description: string;
  debit: string;
  credit: string;
  transactionId?: string;
};

const e2eBillPayment = (): BillPaymentDetails => ({
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

const parseMoney = (value: string): number =>
  Number(value.replace(/[$,]/g, '').trim());

const transferEntries = (entries: E2EActivityEntry[]) =>
  entries.filter((entry) => /transfer/i.test(entry.description));

const debits = (entries: E2EActivityEntry[]) =>
  transferEntries(entries).filter((entry) => entry.debit !== '');

const credits = (entries: E2EActivityEntry[]) =>
  transferEntries(entries).filter((entry) => entry.credit !== '');

async function openOverview(world: CustomWorld): Promise<void> {
  await world.accountsOverviewPage.open();
  await world.accountsOverviewPage.verifyDefaultAccountCreated();
}

async function readActivity(
  world: CustomWorld,
  accountId: string
): Promise<E2EActivityEntry[]> {
  await openOverview(world);
  await world.accountsOverviewPage.openAccountDetails(accountId);
  return world.accountActivityPage.getTransactionEntries();
}

When(
  'the customer opens checking and savings accounts in the E2E flow',
  { timeout: 60_000 },
  async function (this: CustomWorld) {
    await openOverview(this);
    this.sourceAccountId = (await this.accountsOverviewPage.getAccountIds())[0];

    await this.accountOpeningPage.open();
    this.destinationAccountId = await this.accountOpeningPage.openAccount(
      'CHECKING',
      this.sourceAccountId
    );

    await this.accountOpeningPage.open();
    this.e2eSavingsAccountId = await this.accountOpeningPage.openAccount(
      'SAVINGS',
      this.sourceAccountId
    );
  }
);

When(
  'the customer funds the savings account from the checking account',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    if (!this.destinationAccountId || !this.e2eSavingsAccountId) {
      throw new Error(
        'Checking and savings account IDs are required for funding.'
      );
    }

    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      '1',
      this.destinationAccountId,
      this.e2eSavingsAccountId
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
    expect(this.transferResponse).toMatch(/transfer complete/i);
  }
);

Then(
  'the customer should be automatically logged in',
  async function (this: CustomWorld) {
    await expect(
      this.page.getByRole('link', { name: /log out/i })
    ).toBeVisible();
  }
);

Then(
  'the checking and savings balances should be valid',
  async function (this: CustomWorld) {
    await openOverview(this);
    const checkingBalance = parseMoney(
      await this.accountsOverviewPage.getAccountBalance(
        this.destinationAccountId!
      )
    );
    const savingsBalance = parseMoney(
      await this.accountsOverviewPage.getAccountBalance(
        this.e2eSavingsAccountId!
      )
    );
    expect(checkingBalance).toBeGreaterThanOrEqual(0);
    expect(savingsBalance).toBeGreaterThanOrEqual(0);
  }
);

Then(
  'the checking and savings account activity should be displayed',
  async function (this: CustomWorld) {
    const checkingActivity = await readActivity(
      this,
      this.destinationAccountId!
    );
    const savingsActivity = await readActivity(this, this.e2eSavingsAccountId!);
    expect(checkingActivity.length).toBeGreaterThan(0);
    expect(savingsActivity.length).toBeGreaterThan(0);
  }
);

When(
  'the customer logs in for the E2E transfer flow',
  async function (this: CustomWorld) {
    await expect(
      this.page.getByRole('link', { name: /log out/i })
    ).toBeVisible();
  }
);

When(
  'the customer selects source and destination accounts for the E2E transfer',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await openOverview(this);
    const accountIds = await this.accountsOverviewPage.getAccountIds();
    if (accountIds.length < 2) {
      throw new Error(
        'At least two accounts are required for the E2E transfer.'
      );
    }
    this.sourceAccountId = accountIds[0];
    this.destinationAccountId = accountIds[1];
  }
);

When(
  'the customer transfers {string} between the selected accounts',
  { timeout: 30_000 },
  async function (this: CustomWorld, amount: string) {
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      amount,
      this.sourceAccountId!,
      this.destinationAccountId!
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
    expect(this.transferResponse).toMatch(/transfer complete/i);
  }
);

async function readTransferActivities(this: CustomWorld): Promise<{
  source: E2EActivityEntry[];
  destination: E2EActivityEntry[];
}> {
  return {
    source: await readActivity(this, this.sourceAccountId!),
    destination: await readActivity(this, this.destinationAccountId!)
  };
}

Then(
  'the E2E source account should show a debit of {string}',
  async function (this: CustomWorld, amount: string) {
    const activities = await readTransferActivities.call(this);
    expect(
      debits(activities.source).map((entry) => parseMoney(entry.debit))
    ).toContain(parseMoney(amount));
  }
);

Then(
  'the E2E destination account should show a credit of {string}',
  async function (this: CustomWorld, amount: string) {
    const activities = await readTransferActivities.call(this);
    expect(
      credits(activities.destination).map((entry) => parseMoney(entry.credit))
    ).toContain(parseMoney(amount));
  }
);

Then(
  'the E2E transfer ledger should contain matching debit and credit entries',
  async function (this: CustomWorld) {
    const activities = await readTransferActivities.call(this);
    const sourceAmounts = debits(activities.source).map((entry) =>
      parseMoney(entry.debit)
    );
    const destinationAmounts = credits(activities.destination).map((entry) =>
      parseMoney(entry.credit)
    );
    expect(sourceAmounts.at(-1)).toBe(destinationAmounts.at(-1));
  }
);

When(
  'the customer opens and funds a savings account',
  { timeout: 60_000 },
  async function (this: CustomWorld) {
    await this.accountsOverviewPage.open();
    await this.accountsOverviewPage.verifyDefaultAccountCreated();
    this.sourceAccountId = (await this.accountsOverviewPage.getAccountIds())[0];

    await this.accountOpeningPage.open();
    this.e2eSavingsAccountId = await this.accountOpeningPage.openAccount(
      'SAVINGS',
      this.sourceAccountId
    );

    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      '1',
      this.sourceAccountId,
      this.e2eSavingsAccountId
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
    expect(this.transferResponse).toMatch(/transfer complete/i);
  }
);

When(
  'the customer applies for a valid loan in the end-to-end flow',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    this.loanSourceAccountId = this.sourceAccountId;
    await this.loanPage.open();
    await this.loanPage.apply(
      testData.loan.amount,
      testData.loan.downPayment,
      this.loanSourceAccountId!
    );
    this.loanResponse = await this.loanPage.getResponse();
    this.loanAccountId = await this.loanPage.getLoanAccountId();
  }
);

When(
  'the customer pays a bill from the approved loan account',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    if (!this.loanAccountId) {
      throw new Error(
        'The approved loan account ID is required before bill payment.'
      );
    }

    await this.billPayPage.open();
    await this.billPayPage.fillPayment(e2eBillPayment());
    await this.billPayPage.submitPayment(this.loanAccountId);
    this.billPayResponse = await this.billPayPage.getResponse();
  }
);

Then(
  'the end-to-end ledger should contain the loan and bill-payment entries',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    expect(this.billPayResponse).toMatch(
      /bill payment complete|payment complete/i
    );
    await this.accountsOverviewPage.open();
    await this.accountsOverviewPage.openAccountDetails(this.loanAccountId!);
    this.e2eLedgerEntries =
      await this.accountActivityPage.getTransactionEntries();

    expect(this.e2eLedgerEntries.length).toBeGreaterThanOrEqual(2);
    expect(
      this.e2eLedgerEntries.some((entry) => /loan/i.test(entry.description))
    ).toBeTruthy();
    expect(
      this.e2eLedgerEntries.some((entry) =>
        /bill payment|payment/i.test(entry.description)
      )
    ).toBeTruthy();
  }
);
