/** Step definitions for valid ParaBank login and account-overview navigation. */
import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import testData from '../data/test-data.json';
import { config } from '../support/config';

When(
  'the customer logs in using the shared test user',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    this.registeredCredentials = {
      username: testData.registration.username,
      password: testData.registration.password
    };

    await this.loginPage.login(
      this.registeredCredentials.username,
      this.registeredCredentials.password
    );
  }
);

When(
  'the customer logs out of ParaBank',
  async function (this: CustomWorld) {
    await this.loginPage.logout();
  }
);

When(
  'the customer logs in to ParaBank using valid credentials',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    const credentials = this.registeredCredentials;

    if (!credentials) {
      throw new Error(
        'Registered credentials are missing. Add a login or registration step to the scenario.'
      );
    }

    await this.page.goto(config.baseUrl);
    await this.loginPage.login(credentials.username, credentials.password);
  }
);

When(
  'the customer logs in with an invalid username',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    await this.loginPage.loginWithInvalidCredentials(
      `${testData.registration.username}invalid`,
      testData.registration.password
    );
  }
);

When(
  'the customer logs in with an invalid password',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    await this.loginPage.loginWithInvalidCredentials(
      testData.registration.username,
      `${testData.registration.password}invalid`
    );
  }
);

When(
  'the customer submits blank username and password',
  async function (this: CustomWorld) {
    await this.loginPage.submitBlankCredentials();
  }
);

Then(
  'the customer should remain on the login page',
  async function (this: CustomWorld) {
    await this.loginPage.verifyLoginPageDisplayed();
  }
);

Then(
  'the customer should be logged out and see the login page',
  async function (this: CustomWorld) {
    await this.loginPage.logout();
    await this.loginPage.verifyLoginPageDisplayed();
  }
);

Then(
  'the customer should see the Accounts Overview page',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    await expect(
      this.page.getByRole('link', { name: 'Accounts Overview' })
    ).toBeVisible();
  }
);
