import { Locator, Page } from '@playwright/test';

export class UpdateContactInfoLocators {
  readonly address: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly zipCode: Locator;
  readonly phone: Locator;
  readonly updateProfileButton: Locator;
  readonly updateContactInfoLink: Locator;

  constructor(page: Page) {
    this.address = page.locator('input[name="customer.address.street"]');
    this.city = page.locator('input[name="customer.address.city"]');
    this.state = page.locator('input[name="customer.address.state"]');
    this.zipCode = page.locator('input[name="customer.address.zipCode"]');
    this.phone = page.locator('input[name="customer.phoneNumber"]');
    this.updateProfileButton = page.locator('input[value="Update Profile"]');
    this.updateContactInfoLink = page.getByRole('link', {
      name: 'Update Contact Info'
    });
  }
}
