@transaction-search
Feature: ParaBank transaction search and reconciliation

  Background:
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer prepares an account for transaction search

  Scenario: TC081 Find transaction by transaction ID
    When the customer searches transactions by the first transaction ID
    Then the matching transaction should be displayed

  Scenario: TC082 Find transaction by date
    When the customer searches transactions by the first transaction date
    Then transactions for that date should be displayed

  Scenario: TC083 Find transactions by date range
    When the customer searches transactions by the first transaction date range
    Then transactions within the date range should be displayed

  Scenario: TC084 Find transactions by amount
    When the customer searches transactions by the first transaction amount
    Then transactions matching the amount should be displayed

  Scenario: TC085 Search with same start and end date
    When the customer searches transactions with the same start and end date
    Then transactions for that date should be displayed

  Scenario: TC086 Search with end date before start date
    When the customer searches transactions with the end date before the start date
    Then the transaction search should return no results

  Scenario: TC087 Search with invalid date format
    When the customer searches transactions with an invalid date format
    Then the transaction search should return no results

  Scenario: TC088 Search using future date
    When the customer searches transactions using a future date
    Then the transaction search should return no results

  Scenario: TC089 Search amount with no matching transaction
    When the customer searches transactions using an unmatched amount
    Then the transaction search should return no results

  Scenario: TC090 Verify empty search-result state
    When the customer searches transactions using an unmatched amount
    Then the empty transaction-result state should be displayed

  Scenario: TC091 Seed 50+ transactions through API
    When the customer seeds 50 transactions through the API
    Then the API should report at least 50 transactions

  Scenario: TC092 Verify transaction pagination
    When the customer seeds 50 transactions through the API
    And the customer opens the account activity page
    Then transaction pagination should be displayed

  Scenario: TC093 Verify transactions are ordered newest-first
    When the customer opens the account activity page
    Then transactions should be ordered newest-first

  Scenario: TC094 Compare UI transaction data with API data
    When the customer opens the account activity page
    Then the UI transaction data should match the API data

  Scenario: TC095 Reconcile transactions for 3 accounts
    When the customer prepares three accounts for transaction reconciliation
    Then transactions should reconcile across all 3 accounts