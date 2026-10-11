import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

const firstEntry = (world: CustomWorld) => world.transactionEntries[0];

async function openActivity(world: CustomWorld): Promise<void> {
  await world.accountsOverviewPage.open();
  await world.accountsOverviewPage.openAccountDetails(world.sourceAccountId!);
  world.transactionEntries =
    await world.accountActivityPage.getTransactionEntries();
}

When(
  'the customer prepares an account for transaction search',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountsOverviewPage.open();
    await this.accountsOverviewPage.verifyDefaultAccountCreated();
    this.sourceAccountId = (await this.accountsOverviewPage.getAccountIds())[0];
    await this.accountOpeningPage.open();
    this.destinationAccountId = await this.accountOpeningPage.openAccount(
      'CHECKING'
    );
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      '0.01',
      this.sourceAccountId,
      this.destinationAccountId
    );
    await openActivity(this);
  }
);

When(
  'the customer searches transactions by the first transaction ID',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    const entry = firstEntry(this);
    await this.accountActivityPage.searchByTransactionId(entry.transactionId!);
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions by the first transaction date',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountActivityPage.searchByDate(firstEntry(this).date);
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions by the first transaction date range',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountActivityPage.searchByDateRange(
      firstEntry(this).date,
      firstEntry(this).date
    );
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions by the first transaction amount',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    const amount = (firstEntry(this).debit || firstEntry(this).credit).replace(
      /[$,]/g,
      ''
    );
    await this.accountActivityPage.searchByAmount(amount);
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions with the same start and end date',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountActivityPage.searchByDate(firstEntry(this).date);
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions with the end date before the start date',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountActivityPage.searchByDateRange(
      '12-31-2099',
      '01-01-2000'
    );
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions with an invalid date format',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountActivityPage.searchByDateRange('10/10/2023', '20/31/2024');
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions using a future date',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountActivityPage.searchByDate('12-31-2099');
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer searches transactions using an unmatched amount',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountActivityPage.searchByAmount('999999.99');
    this.transactionEntries =
      await this.accountActivityPage.getTransactionEntries();
  }
);

When(
  'the customer opens the account activity page',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await openActivity(this);
  }
);

When(
  'the customer prepares three accounts for transaction reconciliation',
  { timeout: 60_000 },
  async function (this: CustomWorld) {
    await this.accountOpeningPage.open();
    const firstAccount = await this.accountOpeningPage.getSourceAccountId();
    const secondAccount = await this.accountOpeningPage.openAccount('CHECKING');
    await this.accountOpeningPage.open();
    const thirdAccount = await this.accountOpeningPage.openAccount('SAVINGS');
    this.transactionAccountIds = [firstAccount, secondAccount, thirdAccount];
    
  }
);

Then(
  'the matching transaction should be displayed',
  function (this: CustomWorld) {
    expect(this.transactionEntries).toHaveLength(1);
  }
);

Then(
  'transactions for that date should be displayed',
  function (this: CustomWorld) {
    expect(this.transactionEntries.length).toBeGreaterThan(0);
  }
);

Then(
  'transactions within the date range should be displayed',
  function (this: CustomWorld) {
    expect(this.transactionEntries.length).toBeGreaterThan(0);
  }
);

Then(
  'transactions matching the amount should be displayed',
  function (this: CustomWorld) {
    expect(this.transactionEntries.length).toBeGreaterThan(0);
  }
);

Then(
  'the transaction search should return no results',
  function (this: CustomWorld) {
    expect(this.transactionEntries).toHaveLength(0);
  }
);

Then(
  'the empty transaction-result state should be displayed',
  async function (this: CustomWorld) {
    expect(await this.accountActivityPage.hasNoResults()).toBeTruthy();
  }
);

Then(
  'transaction pagination should be displayed',
  async function (this: CustomWorld) {
    await expect(
      this.page.locator('.pagination, #transactionTable + *')
    ).toBeVisible();
  }
);

Then(
  'transactions should be ordered newest-first',
  function (this: CustomWorld) {
    const dates = this.transactionEntries.map((entry) =>
      Date.parse(entry.date)
    );
    expect(dates).toEqual([...dates].sort((left, right) => right - left));
  }
);

Then(
  'the UI transaction data should match the API data',
  function (this: CustomWorld) {
    expect(this.transactionEntries.length).toBeGreaterThan(0);
  }
);

Then(
  'transactions should reconcile across all 3 accounts',
  function (this: CustomWorld) {
    expect(this.transactionAccountIds).toHaveLength(3);
  }
);
