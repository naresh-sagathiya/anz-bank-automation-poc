import { APIRequestContext, expect } from '@playwright/test';

export class ApiDataClient {
  constructor(private readonly api: APIRequestContext) {}

  async getCustomerAccounts(customerId: string): Promise<unknown> {
    const response = await this.api.get(
      `/services/bank/customers/${customerId}/accounts`
    );
    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async get(path: string): Promise<unknown> {
    const response = await this.api.get(path);
    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async getAccountTransactions(
    accountId: string,
    query = ''
  ): Promise<unknown> {
    return this.get(
      `/services/bank/accounts/${accountId}/transactions${query}`
    );
  }

  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: string
  ): Promise<unknown> {
    const response = await this.api.post('/services/bank/transfer', {
      form: { fromAccountId, toAccountId, amount }
    });
    expect(response.ok()).toBeTruthy();
    return response.json();
  }
}
