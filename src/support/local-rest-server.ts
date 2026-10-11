import express, { ErrorRequestHandler, Request, Response } from 'express';
import { Server } from 'node:http';
import { randomUUID } from 'node:crypto';

type Customer = {
  id: string;
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

type Account = {
  id: string;
  customerId: string;
  type: string;
  balance: number;
};

type Transaction = {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  date: string;
};

const app = express();
const customers = new Map<string, Customer>();
const accounts = new Map<string, Account>();
const transactions = new Map<string, Transaction[]>();
let nextCustomerId = 1;
let nextAccountId = 1001;
let server: Server | undefined;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.text({ type: ['text/xml', 'application/soap+xml'] }));

const sendError = (
  response: Response,
  status: number,
  message: string
): void => {
  response.status(status).json({ message });
};

const customerFields: Array<keyof Omit<Customer, 'id'>> = [
  'firstName',
  'lastName',
  'address',
  'city',
  'state',
  'zipCode',
  'phoneNumber',
  'ssn',
  'username',
  'password'
];

const supportsFormOrJson = (request: Request): boolean =>
  Boolean(
    request.is('application/x-www-form-urlencoded') ||
    request.is('application/json')
  );

const recordTransaction = (
  accountId: string,
  type: string,
  amount: number
): void => {
  const entry: Transaction = {
    id: randomUUID(),
    accountId,
    type,
    amount,
    date: new Date().toISOString()
  };
  transactions.set(accountId, [...(transactions.get(accountId) ?? []), entry]);
};

app.post('/services/bank/customers', (request, response) => {
  if (!supportsFormOrJson(request)) {
    sendError(response, 415, 'Content-Type must be form-urlencoded or JSON');
    return;
  }

  const body = request.body as Record<string, unknown> | undefined;
  if (!body || customerFields.some((field) => !body[field])) {
    sendError(response, 400, 'All customer fields are required');
    return;
  }

  const customer = {
    id: String(nextCustomerId++),
    ...Object.fromEntries(customerFields.map((field) => [field, body[field]]))
  } as Customer;
  customers.set(customer.id, customer);
  response.status(201).json(customer);
});

app.get('/services/bank/customers/:customerId', (request, response) => {
  const customer = customers.get(request.params.customerId);
  if (!customer) {
    sendError(response, 404, 'Customer not found');
    return;
  }
  response.json(customer);
});

app.put('/services/bank/customers/:customerId', (request, response) => {
  const customer = customers.get(request.params.customerId);
  if (!customer) {
    sendError(response, 404, 'Customer not found');
    return;
  }
  if (!supportsFormOrJson(request)) {
    sendError(response, 415, 'Content-Type must be form-urlencoded or JSON');
    return;
  }
  Object.assign(customer, request.body);
  response.json(customer);
});

app.delete('/services/bank/customers/:customerId', (request, response) => {
  if (!customers.delete(request.params.customerId)) {
    sendError(response, 404, 'Customer not found');
    return;
  }
  response.status(204).end();
});

app.get(
  '/services/bank/customers/:customerId/accounts',
  (request, response) => {
    if (!customers.has(request.params.customerId)) {
      sendError(response, 404, 'Customer not found');
      return;
    }
    response.json(
      [...accounts.values()].filter(
        (account) => account.customerId === request.params.customerId
      )
    );
  }
);

app.post('/services/bank/createAccount', (request, response) => {
  if (!supportsFormOrJson(request)) {
    sendError(response, 415, 'Content-Type must be form-urlencoded or JSON');
    return;
  }
  const customerId = String(request.body?.customerId ?? '');
  if (!customers.has(customerId)) {
    sendError(response, 404, 'Customer not found');
    return;
  }

  const account: Account = {
    id: String(nextAccountId++),
    customerId,
    type: String(request.body?.newAccountType ?? 'SAVINGS'),
    balance: 1000
  };
  accounts.set(account.id, account);
  transactions.set(account.id, []);
  response.status(201).json(account);
});

app.get('/services/bank/accounts/:accountId', (request, response) => {
  const account = accounts.get(request.params.accountId);
  if (!account) {
    sendError(response, 404, 'Account not found');
    return;
  }
  response.json(account);
});

app.get(
  '/services/bank/accounts/:accountId/transactions',
  (request, response) => {
    const accountTransactions = transactions.get(request.params.accountId);
    if (!accountTransactions) {
      sendError(response, 404, 'Account not found');
      return;
    }
    response.json(accountTransactions);
  }
);

app.post('/services/bank/transfer', (request, response) => {
  if (!supportsFormOrJson(request)) {
    sendError(response, 415, 'Content-Type must be form-urlencoded or JSON');
    return;
  }
  const from = accounts.get(String(request.body?.fromAccountId ?? ''));
  const to = accounts.get(String(request.body?.toAccountId ?? ''));
  const amount = Number(request.body?.amount);
  if (!from || !to) {
    sendError(response, 404, 'Source or destination account not found');
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0 || from.id === to.id) {
    sendError(response, 400, 'Transfer amount or accounts are invalid');
    return;
  }
  if (from.balance < amount) {
    sendError(response, 400, 'Insufficient funds');
    return;
  }

  from.balance -= amount;
  to.balance += amount;
  recordTransaction(from.id, 'Debit', -amount);
  recordTransaction(to.id, 'Credit', amount);
  response.json({
    message: 'Transfer completed',
    fromAccountId: from.id,
    toAccountId: to.id,
    amount
  });
});

app.post('/services/bank/billpay', (request, response) => {
  if (!supportsFormOrJson(request)) {
    sendError(response, 415, 'Content-Type must be form-urlencoded or JSON');
    return;
  }
  const account = accounts.get(String(request.body?.accountId ?? ''));
  const amount = Number(request.body?.amount);
  if (!account) {
    sendError(response, 404, 'Account not found');
    return;
  }
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !request.body?.payeeName ||
    !request.body?.payeeAccountNumber ||
    request.body.payeeAccountNumber !== request.body.verifyAccount
  ) {
    sendError(response, 400, 'Bill payment details are invalid');
    return;
  }
  if (account.balance < amount) {
    sendError(response, 400, 'Insufficient funds');
    return;
  }

  account.balance -= amount;
  recordTransaction(account.id, 'Bill Payment', -amount);
  response.json({
    message: 'Bill payment completed',
    accountId: account.id,
    amount
  });
});

app.post('/services/bank/soap/CustomerService', (request, response) => {
  if (!request.is('text/xml') && !request.is('application/soap+xml')) {
    sendError(response, 415, 'SOAP requests must use an XML Content-Type');
    return;
  }
  const customerId = String(request.body ?? '').match(
    /<customerId>([^<]+)<\/customerId>/
  )?.[1];
  const customer = customerId ? customers.get(customerId) : undefined;
  if (!customer) {
    response
      .status(404)
      .type('text/xml')
      .send('<error>Customer not found</error>');
    return;
  }

  response
    .type('text/xml')
    .send(
      `<?xml version="1.0" encoding="UTF-8"?><customer><id>${customer.id}</id><firstName>${customer.firstName}</firstName><lastName>${customer.lastName}</lastName><username>${customer.username}</username></customer>`
    );
});

const handleRequestError: ErrorRequestHandler = (
  error,
  _request,
  response,
  next
) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  const status = Number(error?.status) || 400;
  sendError(
    response,
    status,
    status === 400 ? 'Malformed request body' : 'Request failed'
  );
};

app.use(handleRequestError);

export const startLocalRestServer = (): Promise<string> =>
  new Promise((resolve, reject) => {
    if (server?.listening) {
      const address = server.address();
      if (address && typeof address !== 'string') {
        resolve(`http://127.0.0.1:${address.port}`);
        return;
      }
    }

    server = app.listen(0, '127.0.0.1', () => {
      const address = server?.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Could not determine local REST server address'));
        return;
      }
      resolve(`http://127.0.0.1:${address.port}`);
    });
    server.once('error', reject);
  });

export const stopLocalRestServer = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!server?.listening) {
      resolve();
      return;
    }
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      server = undefined;
      resolve();
    });
  });
