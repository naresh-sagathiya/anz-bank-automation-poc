import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import testData from '../data/test-data.json';
import {
  isAccountSchema,
  isCustomerSchema,
  isTransactionSchema
} from '../data/api-schemas';
import { CustomerPayload, RestApiClient } from '../data/rest-api-client';
import { CustomWorld } from '../support/world';

const client = (world: CustomWorld) => new RestApiClient(world.api);

const payload = (): CustomerPayload => ({
  firstName: testData.registration.firstName,
  lastName: testData.registration.lastName,
  address: testData.registration.address,
  city: testData.registration.city,
  state: testData.registration.state,
  zipCode: testData.registration.zipCode,
  phoneNumber: testData.registration.phone,
  ssn: testData.registration.ssn,
  username: `api${Date.now()}`,
  password: testData.registration.password
});

const responseId = (body: unknown): string => {
  if (!body || typeof body !== 'object') return '';
  const value = body as Record<string, unknown>;
  return String(value.id ?? value.customerId ?? value.accountId ?? '');
};

Given(
  'the REST API customer payload is prepared',
  function (this: CustomWorld) {
    this.restCustomerPayload = payload();
  }
);

When(
  'the customer is created through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).createCustomer(
      this.restCustomerPayload!
    );
    this.restCustomerId = responseId(this.restResult.body);
  }
);

Given('a REST customer exists', async function (this: CustomWorld) {
  this.restCustomerPayload = this.restCustomerPayload ?? payload();
  this.restResult = await client(this).createCustomer(this.restCustomerPayload);
  this.restCustomerId = responseId(this.restResult.body);
});

When(
  'the customer is retrieved through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).getCustomer(this.restCustomerId!);
  }
);

When(
  'the customer is updated through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).updateCustomer(this.restCustomerId!, {
      city: 'UpdatedApiCity'
    });
  }
);

When(
  'the customer is deleted through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).deleteCustomer(this.restCustomerId!);
  }
);

When('an account is created through REST', async function (this: CustomWorld) {
  this.restResult = await client(this).createAccount(this.restCustomerId!);
  this.restAccountId = responseId(this.restResult.body);
});

Given('a REST account exists', async function (this: CustomWorld) {
  this.restCustomerPayload = this.restCustomerPayload ?? payload();
  const customer = await client(this).createCustomer(this.restCustomerPayload);
  this.restCustomerId = responseId(customer.body);
  this.restResult = await client(this).createAccount(this.restCustomerId);
  this.restAccountId = responseId(this.restResult.body);
});

Given('two REST accounts exist', async function (this: CustomWorld) {
  await restAccountExists(this);
  const second = await client(this).createAccount(this.restCustomerId!);
  this.restDestinationAccountId = responseId(second.body);
});

async function restAccountExists(world: CustomWorld): Promise<void> {
  world.restCustomerPayload = world.restCustomerPayload ?? payload();
  const customer = await client(world).createCustomer(
    world.restCustomerPayload
  );
  world.restCustomerId = responseId(customer.body);
  world.restResult = await client(world).createAccount(world.restCustomerId);
  world.restAccountId = responseId(world.restResult.body);
}

When(
  'the account is retrieved through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).getAccount(this.restAccountId!);
  }
);

When(
  'the account transactions are retrieved through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).getTransactions(this.restAccountId!);
    this.restTransactions = Array.isArray(this.restResult.body)
      ? this.restResult.body
      : ((this.restResult.body as { transaction?: unknown[] })?.transaction ??
        []);
  }
);

When(
  'a transfer is performed through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).transfer(
      this.restAccountId!,
      this.restDestinationAccountId!,
      '1'
    );
  }
);

When(
  'a bill payment is performed through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).payBill(this.restAccountId!, '1');
  }
);

When(
  'an invalid customer ID is retrieved through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).getCustomer('invalid-customer-id');
  }
);

When(
  'an invalid account ID is retrieved through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).getAccount('invalid-account-id');
  }
);

When(
  'a malformed customer payload is submitted through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).request(
      'POST',
      '/services/bank/customers',
      {
        data: '{malformed-json',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
);

When(
  'a customer payload missing a required parameter is submitted through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).request(
      'POST',
      '/services/bank/customers',
      {
        form: { firstName: 'MissingFieldsUser' }
      }
    );
  }
);

When(
  'a customer request uses the wrong Content-Type',
  async function (this: CustomWorld) {
    this.restResult = await client(this).request(
      'POST',
      '/services/bank/customers',
      {
        data: JSON.stringify(this.restCustomerPayload),
        headers: { 'Content-Type': 'text/plain' }
      }
    );
  }
);

When(
  'an invalid transfer amount is submitted through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).transfer(
      this.restAccountId!,
      this.restDestinationAccountId!,
      '-1'
    );
  }
);

When(
  'an invalid bill payment is submitted through REST',
  async function (this: CustomWorld) {
    this.restResult = await client(this).payBill(this.restAccountId!, '-1');
  }
);

When(
  'the customer is retrieved through SOAP',
  async function (this: CustomWorld) {
    this.restResult = await client(this).soapCustomer(this.restCustomerId!);
  }
);

Then('the REST response should be successful', function (this: CustomWorld) {
  expect(this.restResult?.status).toBeGreaterThanOrEqual(200);
  expect(this.restResult?.status).toBeLessThan(300);
});

Then(
  'the REST transaction response should be successful',
  function (this: CustomWorld) {
    expect(this.restResult?.status).toBeGreaterThanOrEqual(200);
    expect(this.restResult?.status).toBeLessThan(300);
  }
);

Then('the REST response should be rejected', function (this: CustomWorld) {
  expect(this.restResult?.status).toBeGreaterThanOrEqual(400);
});

Then(
  'the REST customer response should match the customer schema',
  function (this: CustomWorld) {
    expect(isCustomerSchema(this.restResult?.body)).toBeTruthy();
  }
);

Then(
  'the REST account response should match the account schema',
  function (this: CustomWorld) {
    expect(isAccountSchema(this.restResult?.body)).toBeTruthy();
  }
);

Then(
  'the REST transaction response should match the transaction schema',
  function (this: CustomWorld) {
    expect(this.restTransactions?.every(isTransactionSchema)).toBeTruthy();
  }
);

Then('the SOAP response should be successful', function (this: CustomWorld) {
  expect(this.restResult?.status).toBeGreaterThanOrEqual(200);
  expect(this.restResult?.status).toBeLessThan(300);
});
