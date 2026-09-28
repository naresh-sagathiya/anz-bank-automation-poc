@smoke
@account
Feature: ParaBank account opening

  Background:
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer opens the Accounts Overview page

  Scenario: TC028-TC029 Open a new CHECKING account and verify its ID
    When the customer opens the new account page
    And the customer opens a new "CHECKING" account
    Then the new account ID should be displayed

  Scenario: TC030 Verify checking account appears in Accounts Overview
    When the customer opens the new account page
    And the customer opens a new "CHECKING" account
    And the customer opens the Accounts Overview page
    Then the newly created account should appear in Accounts Overview

  Scenario: TC031 Verify source account balance is reduced
    When the customer opens the Accounts Overview page
    And the customer records the source account balance
    And the customer opens the new account page
    And the customer opens a new "CHECKING" account
    Then the source account balance should be reduced

  Scenario: TC032-TC033 Open a new SAVINGS account and verify it appears
    When the customer opens the new account page
    And the customer opens a new "SAVINGS" account
    And the customer opens the Accounts Overview page
    Then the newly created account should appear in Accounts Overview

  Scenario: TC034 Open multiple accounts sequentially
    When the customer opens the new account page
    And the customer opens a new "CHECKING" account
    And the customer opens the new account page
    And the customer opens a new "SAVINGS" account
    Then all newly created account IDs should be unique

  Scenario: TC035-TC036 Open 5 accounts and verify they are displayed
    When the customer opens the new account page
    And the customer opens 5 new "CHECKING" accounts
    And the customer opens the Accounts Overview page
    Then all 5 newly created accounts should appear in Accounts Overview

  Scenario: TC037 Verify individual account balances
    When the customer opens the new account page
    And the customer opens 5 new "CHECKING" accounts
    And the customer opens the Accounts Overview page
    Then each newly created account should have a valid balance

  Scenario: TC038 Verify total balance reconciliation
    When the customer opens the new account page
    And the customer opens 5 new "CHECKING" accounts
    And the customer opens the Accounts Overview page
    Then the total balance should equal the sum of all account balances

  Scenario: TC039-TC040 Attempt account opening with insufficient funds
    When the customer opens the new account page
    And the customer attempts to open an account from an insufficient-funds source account
    Then the account-opening error message should be displayed

  Scenario: TC042 Verify account details after creation
    When the customer opens the new account page
    And the customer opens a new "CHECKING" account
    And the customer opens the new account details
    Then the account details should match the created account