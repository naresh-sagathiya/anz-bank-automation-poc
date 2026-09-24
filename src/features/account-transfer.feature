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
    Then the source account should show a debit of "25"

  Scenario: TC045 Verify destination account credit
    When the customer transfers "25" from the source account to the destination account
    Then the destination account should show a credit of "25"

  Scenario: TC046 Verify matching debit/credit ledger entries
    When the customer transfers "25" from the source account to the destination account
    Then the source and destination should have matching transfer ledger entries for "25"

  Scenario: TC047-TC048 Transfer full available balance and verify source becomes zero
    When the customer transfers the full available source balance to the destination account
    Then the source account balance should be zero

  Scenario: TC049 Transfer amount greater than available balance
    When the customer transfers an amount greater than the available source balance
    Then the transfer should be rejected

  Scenario: TC050 Transfer negative amount
    When the customer transfers "-1" from the source account to the destination account
    Then the transfer should be rejected

  Scenario: TC051 Transfer zero amount
    When the customer transfers "0" from the source account to the destination account
    Then the transfer should be rejected

  Scenario: TC052 Transfer blank amount
    When the customer transfers a blank amount from the source account to the destination account
    Then the transfer should be rejected

  Scenario: TC053 Transfer non-numeric amount
    When the customer transfers "abc" from the source account to the destination account
    Then the transfer should be rejected

  Scenario: TC054 Transfer amount with more than 2 decimal places
    When the customer transfers "1.001" from the source account to the destination account
    Then the transfer should be rejected

  Scenario: TC055-TC056 Transfer using same source and destination account
    When the customer transfers "25" using the source account as both accounts
    Then the same-account transfer should be rejected

  Scenario: TC057 Perform 10 sequential transfers
    When the customer performs 10 sequential transfers of "1"
    Then 10 transfers should be completed

  Scenario: TC058 Verify final source balance after 10 transfers
    When the customer performs 10 sequential transfers of "1"
    Then the source balance should be reduced by "10"

  Scenario: TC059 Verify final destination balance after 10 transfers
    When the customer performs 10 sequential transfers of "1"
    Then the destination balance should be increased by "10"

  Scenario: TC060 Verify 10 debit ledger entries
    When the customer performs 10 sequential transfers of "1"
    Then the source should have 10 debit transfer entries

  Scenario: TC061 Verify 10 credit ledger entries
    When the customer performs 10 sequential transfers of "1"
    Then the destination should have 10 credit transfer entries

  Scenario: TC062 Reconcile total transferred amount with account activity
    When the customer performs 10 sequential transfers of "1"
    Then the account activity should reconcile "10" transferred