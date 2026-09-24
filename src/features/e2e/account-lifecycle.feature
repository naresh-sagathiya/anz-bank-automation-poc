@e2e
Feature: End-to-end account lifecycle and transfers

  Scenario: Register, open accounts, fund savings, and verify activity
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    Then the customer should be automatically logged in
    When the customer opens checking and savings accounts in the E2E flow
    And the customer funds the savings account from the checking account
    Then the checking and savings balances should be valid
    And the checking and savings account activity should be displayed

  Scenario: Login, transfer funds, and verify debit credit and ledger
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer logs in for the E2E transfer flow
    When the customer selects source and destination accounts for the E2E transfer
    And the customer transfers "1" between the selected accounts
    Then the E2E source account should show a debit of "1"
    And the E2E destination account should show a credit of "1"
    And the E2E transfer ledger should contain matching debit and credit entries

  Scenario: Login, transfer a second amount, and verify debit credit and ledger
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer logs in for the E2E transfer flow
    When the customer selects source and destination accounts for the E2E transfer
    And the customer transfers "2" between the selected accounts
    Then the E2E source account should show a debit of "2"
    And the E2E destination account should show a credit of "2"
    And the E2E transfer ledger should contain matching debit and credit entries

  Scenario: Complete the loan and bill-payment customer journey
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer opens and funds a savings account
    And the customer applies for a valid loan in the end-to-end flow
    Then the loan should be approved
    When the customer pays a bill from the approved loan account
    Then the end-to-end ledger should contain the loan and bill-payment entries