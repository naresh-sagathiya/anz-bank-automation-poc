/** Page object for updating a customer's contact information. */
import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { UpdateContactInfoLocators } from '../locators/update-contact-info.locators';

export type UpdateContactInfoDetails = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
};

export class UpdateContactInfoPage extends BasePage {
  readonly locators: UpdateContactInfoLocators;
  constructor(page: Page) {
    super(page);
    this.locators = new UpdateContactInfoLocators(page);
  }

  async updateContactInfo(data: UpdateContactInfoDetails): Promise<void> {
    await this.locators.updateContactInfoLink.click();
    await this.locators.address.fill(data.address);
    await this.locators.city.fill(data.city);
    await this.locators.state.fill(data.state);
    await this.locators.zipCode.fill(data.zipCode);
    await this.locators.phone.fill(data.phone);
    await this.locators.updateProfileButton.click();
    expect(
      await this.page.locator('#updateProfileResult').textContent()
    ).toContain(
      'Your updated address and phone number have been added to the system. '
    );
    console.log(await this.page.locator('#updateProfileResult').textContent());
  }
}
