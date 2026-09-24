import { APIRequestContext } from '@playwright/test';

export type CustomerPayload = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
};

export type ApiResult = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  text: string;
};

export class RestApiClient {
  constructor(private readonly api: APIRequestContext) {}

  async request(
    method: string,
    path: string,
    options: {
      form?: Record<string, string>;
      data?: unknown;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResult> {
    const response = await this.api.fetch(path, {
      method,
      form: options.form,
      data: options.data,
      headers: options.headers
    });
    const text = await response.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {
      // Keep XML or plain-text responses as text.
    }
    return {
      status: response.status(),
      headers: response.headers(),
      body,
      text
    };
  }

  createCustomer(payload: CustomerPayload): Promise<ApiResult> {
    return this.request('POST', '/services/bank/customers', { form: payload });
  }

  getCustomer(customerId: string): Promise<ApiResult> {
    return this.request('GET', `/services/bank/customers/${customerId}`);
  }

  updateCustomer(
    customerId: string,
    payload: Partial<CustomerPayload>
  ): Promise<ApiResult> {
    return this.request('PUT', `/services/bank/customers/${customerId}`, {
      form: payload
    });
  }

  deleteCustomer(customerId: string): Promise<ApiResult> {
    return this.request('DELETE', `/services/bank/customers/${customerId}`);
  }

  createAccount(
    customerId: string,
    accountType = 'SAVINGS',
    fromAccountId = ''
  ): Promise<ApiResult> {
    return this.request('POST', '/services/bank/createAccount', {
      form: { customerId, newAccountType: accountType, fromAccountId }
    });
  }

  getAccount(accountId: string): Promise<ApiResult> {
    return this.request('GET', `/services/bank/accounts/${accountId}`);
  }

  getTransactions(accountId: string): Promise<ApiResult> {
    return this.request(
      'GET',
      `/services/bank/accounts/${accountId}/transactions`
    );
  }

  transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: string
  ): Promise<ApiResult> {
    return this.request('POST', '/services/bank/transfer', {
      form: { fromAccountId, toAccountId, amount }
    });
  }

  payBill(fromAccountId: string, amount: string): Promise<ApiResult> {
    return this.request('POST', '/services/bank/billpay', {
      form: {
        accountId: fromAccountId,
        amount,
        payeeName: 'API Test Utilities',
        payeeAddress: '1 API Road',
        payeeCity: 'MockCity',
        payeeState: 'TestState',
        payeeZipCode: '12345',
        payeePhoneNumber: '5551234567',
        payeeAccountNumber: '987654',
        verifyAccount: '987654'
      }
    });
  }

  soapCustomer(customerId: string): Promise<ApiResult> {
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body><getCustomer><customerId>${customerId}</customerId></getCustomer></soap:Body>
</soap:Envelope>`;
    return this.request('POST', '/services/bank/soap/CustomerService', {
      data: body,
      headers: { 'Content-Type': 'text/xml; charset=utf-8' }
    });
  }
}
