import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

const parseMoney = (value: string): number =>
  Number(value.replace(/[$,]/g, '').trim());

const transferEntries = (
  entries: Array<{ description: string; debit: string; credit: string }>
) => entries.filter((entry) => /transfer/i.test(entry.description));

const debitEntries = (world: CustomWorld) =>
  transferEntries(world.sourceActivityEntries).filter(
    (entry) => entry.debit !== ''
  );

const creditEntries = (world: CustomWorld) =>
  transferEntries(world.destinationActivityEntries).filter(
    (entry) => entry.credit !== ''
  );

async function getCurrentBalances(
  world: CustomWorld
): Promise<{ source: number; destination: number }> {
  await world.accountsOverviewPage.open();
  const source = parseMoney(
    await world.accountsOverviewPage.getAccountBalance(world.sourceAccountId!)
  );
  const destination = parseMoney(
    await world.accountsOverviewPage.getAccountBalance(
      world.destinationAccountId!
    )
  );
  return { source, destination };
}

async function readActivities(world: CustomWorld): Promise<void> {
  await world.accountsOverviewPage.openAccountDetails(world.sourceAccountId!);
  world.sourceActivityEntries =
    await world.accountActivityPage.getTransferEntries();
  await world.accountsOverviewPage.open();
  await world.accountsOverviewPage.openAccountDetails(
    world.destinationAccountId!
  );
  world.destinationActivityEntries =
    await world.accountActivityPage.getTransferEntries();
}

When(
  'the customer prepares two own accounts for transfer',
  { timeout: 45_000 },
  async function (this: CustomWorld) {
    await this.accountOpeningPage.open();
    this.sourceAccountId = await this.accountOpeningPage.getSourceAccountId();
    this.destinationAccountId =
      await this.accountOpeningPage.openAccount('CHECKING');
    const balances = await getCurrentBalances(this);
    this.sourceBalanceBeforeTransfer = balances.source;
    this.destinationBalanceBeforeTransfer = balances.destination;
  }
);

When(
  'the customer transfers {string} from the source account to the destination account',
  { timeout: 30_000 },
  async function (this: CustomWorld, amount: string) {
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      amount,
      this.sourceAccountId!,
      this.destinationAccountId!
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
    await readActivities(this);
  }
);

When(
  'the customer transfers the full available source balance to the destination account',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    const amount = this.sourceBalanceBeforeTransfer!.toFixed(2);
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      amount,
      this.sourceAccountId!,
      this.destinationAccountId!
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
    const balances = await getCurrentBalances(this);
    this.sourceBalanceBeforeTransfer = balances.source;
    this.destinationBalanceBeforeTransfer = balances.destination;
  }
);

When(
  'the customer transfers an amount greater than the available source balance',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    const amount = (this.sourceBalanceBeforeTransfer! + 1).toFixed(2);
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      amount,
      this.sourceAccountId!,
      this.destinationAccountId!
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
  }
);

When(
  'the customer transfers a blank amount from the source account to the destination account',
  { timeout: 30_000 },
  async function (this: CustomWorld) {
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      '',
      this.sourceAccountId!,
      this.destinationAccountId!
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
  }
);

When(
  'the customer transfers {string} using the source account as both accounts',
  { timeout: 30_000 },
  async function (this: CustomWorld, amount: string) {
    await this.transferFundsPage.open();
    await this.transferFundsPage.transfer(
      amount,
      this.sourceAccountId!,
      this.sourceAccountId!
    );
    this.transferResponse = await this.transferFundsPage.getTransferResponse();
  }
);

When(
  'the customer performs {int} sequential transfers of {string}',
  { timeout: 90_000 },
  async function (this: CustomWorld, count: number, amount: string) {
    await this.transferFundsPage.open();
    for (let index = 0; index < count; index += 1) {
      await this.transferFundsPage.transfer(
        amount,
        this.sourceAccountId!,
        this.destinationAccountId!
      );
      const response = await this.transferFundsPage.getTransferResponse();
      expect(response).toContain('Transfer Complete');
      this.transferAmounts.push(parseMoney(amount));
    }
    await readActivities(this);
  }
);

Then('the transfer should be completed', function (this: CustomWorld) {
  expect(this.transferResponse).toContain('Transfer Complete');
});

Then(
  'the source account should show a debit of {string}',
  function (this: CustomWorld, amount: string) {
    expect(
      debitEntries(this).map((entry) => parseMoney(entry.debit))
    ).toContain(parseMoney(amount));
  }
);

Then(
  'the destination account should show a credit of {string}',
  function (this: CustomWorld, amount: string) {
    expect(
      creditEntries(this).map((entry) => parseMoney(entry.credit))
    ).toContain(parseMoney(amount));
  }
);

Then(
  'the source and destination should have matching transfer ledger entries for {string}',
  function (this: CustomWorld, amount: string) {
    const expected = parseMoney(amount);
    expect(
      debitEntries(this).map((entry) => parseMoney(entry.debit))
    ).toContain(expected);
    expect(
      creditEntries(this).map((entry) => parseMoney(entry.credit))
    ).toContain(expected);
  }
);

Then(
  'the source account balance should be zero',
  async function (this: CustomWorld) {
    const balances = await getCurrentBalances(this);
    expect(balances.source).toBe(0);
  }
);

Then('the transfer should be rejected', function (this: CustomWorld) {
  expect(this.transferResponse).not.toContain('Transfer Complete');
});

Then(
  'the same-account transfer should be rejected',
  function (this: CustomWorld) {
    expect(this.transferResponse).not.toContain('Transfer Complete');
  }
);

Then(
  '{int} transfers should be completed',
  function (this: CustomWorld, count: number) {
    expect(this.transferAmounts).toHaveLength(count);
  }
);

Then(
  'the source balance should be reduced by {string}',
  async function (this: CustomWorld, amount: string) {
    const before = this.sourceBalanceBeforeTransfer!;
    const balances = await getCurrentBalances(this);
    expect(before - balances.source).toBe(parseMoney(amount));
  }
);

Then(
  'the destination balance should be increased by {string}',
  async function (this: CustomWorld, amount: string) {
    const before = this.destinationBalanceBeforeTransfer!;
    const balances = await getCurrentBalances(this);
    expect(balances.destination - before).toBe(parseMoney(amount));
  }
);

Then(
  'the source should have {int} debit transfer entries',
  function (this: CustomWorld, count: number) {
    expect(debitEntries(this)).toHaveLength(count);
  }
);

Then(
  'the destination should have {int} credit transfer entries',
  function (this: CustomWorld, count: number) {
    expect(creditEntries(this)).toHaveLength(count);
  }
);

Then(
  'the account activity should reconcile {string} transferred',
  function (this: CustomWorld, amount: string) {
    const debits = debitEntries(this).reduce(
      (sum, entry) => sum + parseMoney(entry.debit),
      0
    );
    const credits = creditEntries(this).reduce(
      (sum, entry) => sum + parseMoney(entry.credit),
      0
    );
    expect(debits).toBe(parseMoney(amount));
    expect(credits).toBe(parseMoney(amount));
    expect(debits).toBe(credits);
  }
);
