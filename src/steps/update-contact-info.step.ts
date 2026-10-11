/** Step definitions for updating and validating customer contact details. */
import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import testData from '../data/test-data.json';

When(
  'the customer updates Contact details',
  async function (this: CustomWorld) {
    await this.updateContactInfoPage.updateContactInfo(testData.UpdateContactInfo);
  }
);
