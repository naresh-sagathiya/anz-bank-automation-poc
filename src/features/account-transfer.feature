@account-transfer
Feature: ParaBank transfers between own accounts

  Background:
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer prepares two own accounts for transfer

  Scenario: TC043 Transfer money between own accounts
    When the customer transfers "25" from the source account to the destination account
    Then the transfer should be completed

  Scenario: TC044 Verify source account debit
    When the customer transfers "25" from the source account to the destination account
    Then the transfer should be completed
    When the customer opens the Accounts Overview page
    And the customer opens the source account from Accounts Overview
    Then the source account should show a debit of "25"

  Scenario: TC045 Verify destination account credit
    When the customer transfers "25" from the source account to the destination account
    Then the transfer should be completed
    When the customer opens the Accounts Overview page
    And the customer opens the destination account from Accounts Overview
    Then the destination account should show a credit of "25"

  Scenario: TC046 Verify matching debit/credit ledger entries
    When the customer transfers "25" from the source account to the destination account
    Then the transfer should be completed
    When the customer opens the Accounts Overview page
    And the customer opens the source account from Accounts Overview
    When the customer opens the Accounts Overview page
    And the customer opens the destination account from Accounts Overview
    Then the source and destination should have matching transfer ledger entries for "25"

  Scenario: TC047-TC048 Transfer full available balance and verify both account activities
    When the customer transfers the full available source balance to the destination account
    Then the transfer should be completed
    Then the source account balance should be zero
    And the destination balance should increase by the full source balance
    When the customer opens the Accounts Overview page
    And the customer opens the source account from Accounts Overview
    Then the source activity should show a debit for the full source balance
    When the customer opens the Accounts Overview page
    And the customer opens the destination account from Accounts Overview
    Then the destination activity should show a credit for the full source balance

  Scenario: TC049 ParaBank completes a transfer greater than the available balance
    When the customer transfers an amount greater than the available source balance
    Then the transfer should be completed

  Scenario: TC050 ParaBank completes a transfer with a negative amount
    When the customer transfers "-1" from the source account to the destination account
    Then the transfer should be completed

  Scenario: TC051 ParaBank completes a zero-amount transfer
    When the customer transfers "0" from the source account to the destination account
    Then the transfer should be completed

  Scenario: TC052 Transfer blank amount
    When the customer transfers a blank amount from the source account to the destination account
    Then the transfer should be rejected

  Scenario: TC053 Transfer non-numeric amount
    When the customer transfers "abc" from the source account to the destination account
    Then the transfer should be rejected

  Scenario: TC054 ParaBank completes a transfer with more than 2 decimal places
    When the customer transfers "1.001" from the source account to the destination account
    Then the transfer should be completed

  Scenario: TC055-TC056 ParaBank completes a transfer to the same account
    When the customer transfers "25" using the source account as both accounts
    Then the transfer should be completed

  Scenario: TC057-TC062 Perform 10 transfers and reconcile balances and account activity
    When the customer performs 10 sequential transfers of "1"
    Then 10 transfers should be completed
    And the source balance should be reduced by "10"
    And the destination balance should be increased by "10"
    When the customer opens the Accounts Overview page
    And the customer opens the source account from Accounts Overview
    Then the source should have 10 debit transfer entries
    When the customer opens the Accounts Overview page
    And the customer opens the destination account from Accounts Overview
    Then the destination should have 10 credit transfer entries
    And the account activity should reconcile "10" transferred