import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When(
  'the customer opens the Accounts Overview page',
  async function (this: CustomWorld) {
    await this.accountsOverviewPage.open();
  }
);

Then(
  'the default account should be created',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    await this.accountsOverviewPage.verifyDefaultAccountCreated();
  }
);

Then(
  'the default account balance should not be null',
  async function (this: CustomWorld) {
    const balance = await this.accountsOverviewPage.getDefaultAccountBalance();

    expect(balance).not.toBe('');
    expect(balance.toLowerCase()).not.toBe('null');
  }
);