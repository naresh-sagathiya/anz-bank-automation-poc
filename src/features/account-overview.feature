Feature: ParaBank Account Overview

  @smoke
  @account-overview

  Scenario: Verify default account and balance after registration
    
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer opens the Accounts Overview page
    Then the default account should be created
    And the default account balance should not be null