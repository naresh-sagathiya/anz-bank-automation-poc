/** Page object for login, logout, and registration navigation. */
import { Locator, Page } from '@playwright/test';

export class LoginLocators {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly logoutLink: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.logoutLink = page.getByRole('link', { name: /Log Out/i });
    this.loginError = page.locator('#rightPanel p.error');
  }
}
