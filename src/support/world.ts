import {
  APIRequestContext,
  Browser,
  BrowserContext,
  Page
} from '@playwright/test';
import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { LoginPage } from '../pages/login.page';
import { RegistrationPage } from '../pages/registration.page';
import { AccountsOverviewPage } from '../pages/accounts-overview.page';
import { AccountOpeningPage } from '../pages/account-opening.page';
import { TransferFundsPage } from '../pages/transfer-funds.page';
import { AccountActivityPage } from '../pages/account-activity.page';
import { BillPayPage } from '../pages/bill-pay.page';
import { LoanPage } from '../pages/loan.page';
import { ApiResult, CustomerPayload } from '../data/rest-api-client';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  api!: APIRequestContext;
  loginPage!: LoginPage;
  registrationPage!: RegistrationPage;
  accountsOverviewPage!: AccountsOverviewPage;
  accountOpeningPage!: AccountOpeningPage;
  transferFundsPage!: TransferFundsPage;
  accountActivityPage!: AccountActivityPage;
  billPayPage!: BillPayPage;
  loanPage!: LoanPage;
  createdAccountIds: string[] = [];
  sourceAccountBalanceBefore?: number;
  sourceAccountId?: string;
  destinationAccountId?: string;
  sourceBalanceBeforeTransfer?: number;
  destinationBalanceBeforeTransfer?: number;
  transferResponse?: string;
  transferAmounts: number[] = [];
  sourceActivityEntries: Array<{
    description: string;
    debit: string;
    credit: string;
  }> = [];
  destinationActivityEntries: Array<{
    description: string;
    debit: string;
    credit: string;
  }> = [];
  billPayResponse?: string;
  billPayAmount?: number;
  billPaySourceBalanceBefore?: number;
  billPayActivityEntries: Array<{
    description: string;
    debit: string;
    credit: string;
  }> = [];
  transactionEntries: Array<{
    date: string;
    description: string;
    debit: string;
    credit: string;
    transactionId?: string;
  }> = [];
  transactionAccountIds: string[] = [];
  transactionSearchResultCount?: number;
  transactionApiEntries: unknown[] = [];
  loanResponse?: string;
  loanAccountId?: string;
  loanSourceAccountId?: string;
  restCustomerPayload?: CustomerPayload;
  restCustomerId?: string;
  restAccountId?: string;
  restDestinationAccountId?: string;
  restResult?: ApiResult;
  restTransactions?: unknown[];
  e2eSavingsAccountId?: string;
  e2eLedgerEntries: Array<{
    date: string;
    description: string;
    debit: string;
    credit: string;
    transactionId?: string;
  }> = [];
  secondaryPage?: Page;
  secondaryPageData?: string;
  secondaryContext?: BrowserContext;
  registeredCredentials?: {
    username: string;
    password: string;
  };

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initialize(): Promise<void> {
    this.loginPage = new LoginPage(this.page);
    this.registrationPage = new RegistrationPage(this.page);
    this.accountsOverviewPage = new AccountsOverviewPage(this.page);
    this.accountOpeningPage = new AccountOpeningPage(this.page);
    this.transferFundsPage = new TransferFundsPage(this.page);
    this.accountActivityPage = new AccountActivityPage(this.page);
    this.billPayPage = new BillPayPage(this.page);
    this.loanPage = new LoanPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
