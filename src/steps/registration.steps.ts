import { randomInt } from 'node:crypto';
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import testData from '../data/test-data.json';
import { RegistrationDetails } from '../pages/registration.page';
import { config } from '../support/config';

function createUniqueUsername(): string {
  const timestampDigits = Date.now().toString().slice(-4);
  const randomLetters = Array.from({ length: 6 }, () =>
    String.fromCharCode(97 + randomInt(26))
  ).join('');

  return `johndemo${timestampDigits}${randomLetters}`;
}

function createUniqueSsn(): string {
  return randomInt(100_000_000, 1_000_000_000).toString();
}

function createRegistrationDetails(
  username = createUniqueUsername()
): RegistrationDetails {
  const registration = testData.registration;

  return {
    firstName: registration.firstName,
    lastName: registration.lastName,
    address: registration.address,
    city: registration.city,
    state: registration.state,
    zipCode: registration.zipCode,
    phone: registration.phone,
    ssn: createUniqueSsn(),
    username,
    password: registration.password,
    confirmPassword: registration.confirmPassword
  };
}

async function registerWithUniqueUsername(
  world: CustomWorld,
  details: RegistrationDetails
): Promise<RegistrationDetails> {
  let username = details.username;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const attemptDetails = {
      ...details,
      username,
      ssn: attempt === 0 ? details.ssn : createUniqueSsn()
    };

    try {
      await world.registrationPage.register(attemptDetails);
      return attemptDetails;
    } catch (error) {
      const validationMessage = await world.registrationPage.getText(
        world.registrationPage.locators.errorMessage
      );

      if (!/username already exists/i.test(validationMessage) || attempt === 2) {
        throw error;
      }

      username = createUniqueUsername();
      await world.page.reload();
      await world.registrationPage.verifyUrl(/register\.htm/);
    }
  }

  throw new Error('Registration failed after three unique-username attempts.');
}

const registrationFieldLocators = {
  'first name': 'firstName',
  'last name': 'lastName',
  address: 'address',
  city: 'city',
  state: 'state',
  'zip code': 'zipCode',
  ssn: 'ssn',
  username: 'username',
  password: 'password',
  'confirm password': 'confirmPassword'
} as const;

When(
  'the customer opens the registration page',
  async function (this: CustomWorld) {
    await this.loginPage.openRegistration();
  }
);

When(
  'the customer registers with valid details',
  { timeout: 45_000 },
  async function (this: CustomWorld) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (attempt > 0) {
        await this.page.reload();
        await this.registrationPage.verifyUrl(/register\.htm/);
      }

      try {
        await this.registrationPage.register(createRegistrationDetails());
        return;
      } catch (error) {
        if (!(await this.registrationPage.isVisible(this.registrationPage.locators.errorMessage))) {
          throw error;
        }
      }
    }

    throw new Error('Registration failed after three unique-username attempts.');
  }
);

When(
  'the customer submits registration with the {string} field blank',
  { timeout: 15_000 },
  async function (this: CustomWorld, field: string) {
    const fieldKey =
      registrationFieldLocators[
        field as keyof typeof registrationFieldLocators
      ];

    if (!fieldKey) {
      throw new Error(`Unsupported registration field: ${field}`);
    }

    const details = createRegistrationDetails();
    details[fieldKey] = '';
    await this.registrationPage.fillRegistration(details);
    await this.registrationPage.submitRegistration();
  }
);

When(
  'the customer submits registration with a password mismatch',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    const details = createRegistrationDetails();
    details.confirmPassword = `${details.password}-mismatch`;
    await this.registrationPage.fillRegistration(details);
    await this.registrationPage.submitRegistration();
  }
);

When(
  'the customer registers with maximum-length name values',
  { timeout: 60_000 },
  async function (this: CustomWorld) {
    const details = createRegistrationDetails();
    details.firstName = 'A'.repeat(50);
    details.lastName = 'B'.repeat(50);
    await registerWithUniqueUsername(this, details);
  }
);

When(
  'the customer registers with special-character values',
  { timeout: 60_000 },
  async function (this: CustomWorld) {
    const details = createRegistrationDetails();
    details.firstName = "O'Neil & Co.";
    details.lastName = 'Test-User';
    details.address = "12/4 King's Road";
    details.city = 'St. Louis';
    await registerWithUniqueUsername(this, details);
  }
);

When(
  'the customer submits registration with an SQL injection payload',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    const details = createRegistrationDetails("' OR '1'='1");
    await this.registrationPage.fillRegistration(details);
    await this.registrationPage.submitRegistration();
  }
);

When(
  'the customer submits registration with an XSS payload',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    const details = createRegistrationDetails('xss-test');
    details.firstName = '<script>alert(1)</script>';
    await this.registrationPage.fillRegistration(details);
    await this.registrationPage.submitRegistration();
  }
);

When(
  'the customer registers a duplicate username',
  { timeout: 60_000 },
  async function (this: CustomWorld) {
    const username = createUniqueUsername();
    const registeredDetails = await registerWithUniqueUsername(
      this,
      createRegistrationDetails(username)
    );
    await this.loginPage.logout();
    await this.loginPage.openRegistration();
    await this.registrationPage.fillRegistration(
      createRegistrationDetails(registeredDetails.username)
    );
    await this.registrationPage.submitRegistration();
  }
);

When(
  'the customer logs out and directly opens the Accounts Overview page',
  async function (this: CustomWorld) {
    await this.loginPage.logout();
    const overviewUrl = config.baseUrl.replace(/index\.htm$/i, 'overview.htm');
    await this.page.goto(overviewUrl);
  }
);

Then(
  'the customer should see a registration validation error',
  async function (this: CustomWorld) {
    await expect(this.registrationPage.locators.errorMessage).toBeVisible();
  }
);

Then(
  'the customer should be redirected to the login page',
  async function (this: CustomWorld) {
    await this.loginPage.verifyLoginPageDisplayed();
  }
);

Then(
  'the registration should not execute the payload',
  async function (this: CustomWorld) {
    await expect(this.page.locator('body')).not.toContainText(
      '<script>alert(1)</script>'
    );
    await expect(this.page).not.toHaveURL(/javascript:/i);
  }
);

Then(
  'the customer should see the registration success message',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    await expect(
      this.page.getByText(
        'Your account was created successfully. You are now logged in.'
      )
    ).toBeVisible();
  }
);

Then(
  'the customer should be redirected and automatically logged in',
  { timeout: 15_000 },
  async function (this: CustomWorld) {
    await expect(this.page).not.toHaveURL(/(?:index|login)\.htm/i);
    await expect(
      this.page.getByRole('link', { name: /Log Out/i })
    ).toBeVisible();
  }
);
