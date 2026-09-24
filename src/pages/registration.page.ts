import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { RegistrationLocators } from '../locators/registration.locators';

export type RegistrationDetails = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export class RegistrationPage extends BasePage {
  readonly locators: RegistrationLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new RegistrationLocators(page);
  }

  async fillRegistration(details: RegistrationDetails): Promise<void> {
    await this.fill(this.locators.firstName, details.firstName);
    await this.fill(this.locators.lastName, details.lastName);
    await this.fill(this.locators.address, details.address);
    await this.fill(this.locators.city, details.city);
    await this.fill(this.locators.state, details.state);
    await this.fill(this.locators.zipCode, details.zipCode);
    await this.fill(this.locators.phone, details.phone);
    await this.fill(this.locators.ssn, details.ssn);
    await this.fill(this.locators.username, details.username);
    await this.fill(this.locators.password, details.password);
    await this.fill(this.locators.confirmPassword, details.confirmPassword);
  }

  async submitRegistration(): Promise<void> {
    await this.click(this.locators.registerButton, true);
  }

  async register(details: RegistrationDetails): Promise<void> {
    await this.fillRegistration(details);
    await this.submitRegistration();
    await Promise.race([
      this.locators.successMessage.waitFor({ state: 'visible', timeout: 15_000 }),
      this.locators.errorMessage.waitFor({ state: 'visible', timeout: 15_000 })
    ]);

    if (await this.isVisible(this.locators.errorMessage)) {
      throw new Error('Registration failed: validation error displayed.');
    }
  }
}