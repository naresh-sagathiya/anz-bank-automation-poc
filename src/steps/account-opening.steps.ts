import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { AccountType } from '../pages/account-opening.page';
import { CustomWorld } from '../support/world';

const parseMoney = (value: string): number =>
  Number(value.replace(/[$,]/g, '').trim());

When(
  'the customer opens the new account page',
  async function (this: CustomWorld) {
    await this.accountOpeningPage.open();
  }
);

When(
  'the customer opens a new {string} account',
  { timeout: 30_000 },
  async function (this: CustomWorld, type: AccountType) {
    this.sourceAccountId = await this.accountOpeningPage.getSourceAccountId();
    const accountId = await this.accountOpeningPage.openAccount(type);
    this.createdAccountIds.push(accountId);
    console.log(accountId, ">>>>this.createdAccountIds>>>", this.createdAccountIds);
  }
);

When(
  'the customer opens {int} new {string} accounts',
  { timeout: 120_000 },
  async function (this: CustomWorld, count: number, type: AccountType) {
    for (let index = 0; index < count; index += 1) {
      await this.accountOpeningPage.open();
      const accountId = await this.accountOpeningPage.openAccount(type);
      this.createdAccountIds.push(accountId);
    }
  }
);

When(
  'the customer records the source account balance',
  async function (this: CustomWorld) {
    this.sourceAccountId = (await this.accountsOverviewPage.getAccountIds())[0];
    this.sourceAccountBalanceBefore = parseMoney(
      await this.accountsOverviewPage.getAccountBalance(this.sourceAccountId)
    );
  }
);

When(
  'the customer attempts to open an account from an insufficient-funds source account',
  async function (this: CustomWorld) {
    const sourceAccountId = await this.accountOpeningPage.getSourceAccountId();
    await this.accountOpeningPage.openAccount('CHECKING', sourceAccountId);
    await this.accountOpeningPage.open();
    await this.accountOpeningPage.openAccount('CHECKING', sourceAccountId).catch(() => undefined);
  }
);

Then(
  'the new account ID should be displayed',
  async function (this: CustomWorld) {
    console.log('Created account IDs:', this.createdAccountIds);
    expect(this.createdAccountIds.at(-1)).toMatch(/^\d+$/);
  }
);

Then(
  'the newly created account should appear in Accounts Overview',
  async function (this: CustomWorld) {
    const accountIds = await this.accountsOverviewPage.getAccountIds();
    expect(accountIds).toEqual(expect.arrayContaining(this.createdAccountIds));
  }
);

Then(
  'the source account balance should be reduced',
  async function (this: CustomWorld) {
    const currentBalance = parseMoney(
      await this.accountsOverviewPage.getAccountBalance(this.sourceAccountId!)
    );
    expect(currentBalance).toBeLessThan(this.sourceAccountBalanceBefore!);
  }
);

Then(
  'all newly created account IDs should be unique',
  function (this: CustomWorld) {
    expect(new Set(this.createdAccountIds).size).toBe(this.createdAccountIds.length);
  }
);

Then(
  'all 5 newly created accounts should appear in Accounts Overview',
  async function (this: CustomWorld) {
    const accountIds = await this.accountsOverviewPage.getAccountIds();
    expect(accountIds).toEqual(expect.arrayContaining(this.createdAccountIds));
  }
);

Then(
  'each newly created account should have a valid balance',
  async function (this: CustomWorld) {
    for (const accountId of this.createdAccountIds) {
      expect(parseMoney(await this.accountsOverviewPage.getAccountBalance(accountId))).toBeGreaterThanOrEqual(0);
    }
  }
);

Then(
  'the total balance should equal the sum of all account balances',
  async function (this: CustomWorld) {
    const accountIds = await this.accountsOverviewPage.getAccountIds();
    const balances = await Promise.all(
      accountIds.map(accountId => this.accountsOverviewPage.getAccountBalance(accountId))
    );
    const total = parseMoney(await this.accountsOverviewPage.getTotalBalance());
    expect(total).toBeCloseTo(balances.reduce((sum, balance) => sum + parseMoney(balance), 0), 2);
  }
);

Then(
  'the account-opening error message should be displayed',
  async function (this: CustomWorld) {
    await this.accountOpeningPage.verifyOpeningError();
  }
);

When(
  'the customer opens the new account details',
  async function (this: CustomWorld) {
    await this.accountsOverviewPage.openAccountDetails(this.createdAccountIds.at(-1)!);
  }
);

Then(
  'the account details should match the created account',
  async function (this: CustomWorld) {
    await expect(this.page.locator('#accountId')).toHaveText(this.createdAccountIds.at(-1)!);
    await expect(this.page.locator('#accountType')).toHaveText('CHECKING');
  }
);