/** Page object for login, logout, and registration navigation. */
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginLocators } from '../locators/login.locators';

export class LoginPage extends BasePage {
  readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.locators.username, username);
    await this.fill(this.locators.password, password);
    await this.click(this.locators.loginButton, true);
    await this.verifyVisible(this.locators.logoutLink, 15_000);
  }

  async loginWithInvalidCredentials(
    username: string,
    password: string
  ): Promise<void> {
    await this.fill(this.locators.username, username);
    await this.fill(this.locators.password, password);
    await this.click(this.locators.loginButton, true);
    await this.verifyVisible(this.locators.loginError, 15_000);
  }

  async submitBlankCredentials(): Promise<void> {
    await this.fill(this.locators.username, '');
    await this.fill(this.locators.password, '');
    await this.click(this.locators.loginButton, true);
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await this.verifyVisible(this.locators.username, 15_000);
    await this.verifyVisible(this.locators.password, 15_000);
    await this.verifyVisible(this.locators.loginButton, 15_000);
  }

  async logout(): Promise<void> {
    if (await this.isVisible(this.locators.logoutLink)) {
      await this.click(this.locators.logoutLink);
    }
  }

  async openRegistration(): Promise<void> {
    await this.click(this.locators.registerLink);
    await this.waitForUrl(/register\.htm/);
  }
}
