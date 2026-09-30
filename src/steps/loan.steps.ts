import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import testData from '../data/test-data.json';
import { CustomWorld } from '../support/world';

When(
  'the customer prepares to apply for a loan',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.accountsOverviewPage.open();
    await this.accountsOverviewPage.verifyDefaultAccountCreated();
    this.loanSourceAccountId = (
      await this.accountsOverviewPage.getAccountIds()
    )[0];
  }
);

async function applyLoan(
  world: CustomWorld,
  amount: string,
  downPayment: string
): Promise<void> {
  await world.loanPage.open();
  await world.loanPage.apply(amount, downPayment, world.loanSourceAccountId!);
  world.loanResponse = await world.loanPage.getResponse();
  world.loanAccountId = await world.loanPage.getLoanAccountId().catch(() => '');
}

When(
  'the customer applies for a loan with valid amount and down payment',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await applyLoan(this, testData.loan.amount, testData.loan.downPayment);
  }
);

When(
  'the customer applies for a loan with a down payment exceeding the balance',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await applyLoan(this, testData.loan.amount, '999999.99');
  }
);

When(
  'the customer applies for a loan with amount {string}',
  { timeout: 30_000 },
  async function (this: CustomWorld, amount: string) {
    await applyLoan(this, amount, testData.loan.downPayment);
  }
);

When(
  'the customer applies for a loan with a blank amount',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await applyLoan(this, '', testData.loan.downPayment);
  }
);

When(
  'the customer applies for a loan with down payment equal to the loan amount',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await applyLoan(this, testData.loan.amount, testData.loan.amount);
  }
);

When(
  'the customer applies for an approval-matrix loan with amount {string} and down payment {string}',
  { timeout: 30_000 },
  async function (this: CustomWorld, amount: string, downPayment: string) {
    await applyLoan(this, amount, downPayment);
  }
);

When(
  'the customer transfers funds from the approved loan account',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    if (!/approved|congratulations/i.test(this.loanResponse ?? '')) {
      this.transferResponse = `Loan not approved: ${this.loanResponse ?? ''}`;
      return;
    }

    await this.accountsOverviewPage.open();
    const destinationAccountId = (
      await this.accountsOverviewPage.getAccountIds()
    ).find((accountId) => accountId !== this.loanAccountId);
    if (!this.loanAccountId || !destinationAccountId) {
      throw new Error(
        'Approved loan and destination account IDs are required for transfer.'
      );
    }
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      '1',
      this.loanAccountId,
      destinationAccountId
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
  }
);

Then('the loan should be approved', function (this: CustomWorld) {
  expect(this.loanResponse).toMatch(/approved|congratulations/i);
});

Then(
  'the approved loan account should appear when the loan is approved',
  async function (this: CustomWorld) {
    if (!/approved|congratulations/i.test(this.loanResponse ?? '')) {
      expect(this.loanResponse).toMatch(/denied|insufficient funds/i);
      expect(this.loanAccountId).toBe('');
      return;
    }

    expect(this.loanAccountId).not.toBe('');
    await this.accountsOverviewPage.open();
    await expect(
      this.page.getByRole('link', { name: this.loanAccountId!, exact: true })
    ).toBeVisible();
  }
);

Then('the loan should be denied', function (this: CustomWorld) {
  expect(this.loanResponse).not.toMatch(/approved|congratulations/i);
});

Then('the loan decision should be displayed', function (this: CustomWorld) {
  expect(this.loanResponse).toMatch(/approved|denied|error|cannot/i);
});

Then(
  'the loan transfer outcome should match the loan decision',
  function (this: CustomWorld) {
    if (/approved|congratulations/i.test(this.loanResponse ?? '')) {
      expect(this.transferResponse).toMatch(/transfer complete/i);
      return;
    }

    expect(this.loanResponse).toMatch(/denied|insufficient funds/i);
    expect(this.transferResponse).toMatch(/loan not approved/i);
  }
);
