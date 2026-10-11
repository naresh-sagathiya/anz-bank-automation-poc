@transaction-search
Feature: ParaBank transaction search and reconciliation

  Background:
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer prepares an account for transaction search

  Rule: Search account activity

    Scenario: TC081 Find a transaction by its ID
      When the customer searches transactions by the first transaction ID
      Then the matching transaction should be displayed

    Scenario: TC082 Find transactions by transaction date
      When the customer searches transactions by the first transaction date
      Then transactions for that date should be displayed

    Scenario: TC083 Find transactions within a date range
      When the customer searches transactions by the first transaction date range
      Then transactions within the date range should be displayed

    Scenario: TC084 Find transactions by amount
      When the customer searches transactions by the first transaction amount
      Then transactions matching the amount should be displayed

    Scenario: TC085 Search with identical start and end dates
      When the customer searches transactions with the same start and end date
      Then transactions for that date should be displayed

    Scenario: TC086 Return no results when the end date precedes the start date
      When the customer searches transactions with the end date before the start date
      Then the transaction search should return no results

    Scenario: TC087 Return no results for an invalid date format
      When the customer searches transactions with an invalid date format
      Then the transaction search should return no results

    Scenario: TC088 Return no results for a future date
      When the customer searches transactions using a future date
      Then the transaction search should return no results

    Scenario: TC089 Return no results for an unmatched amount
      When the customer searches transactions using an unmatched amount
      Then the transaction search should return no results

    Scenario: TC090 Display the empty transaction-result state
      When the customer searches transactions using an unmatched amount
      Then the empty transaction-result state should be displayed

  Rule: Transaction volume and ordering
  
    Scenario: TC093 Order account activity newest first
      When the customer opens the account activity page
      Then transactions should be ordered newest-first

    Scenario: TC094 Match account activity with API transactions
      When the customer opens the account activity page
      Then the UI transaction data should match the API data

  Rule: Reconcile activity across accounts

    Scenario: TC095 Reconcile transactions across three accounts
      When the customer prepares three accounts for transaction reconciliation
      Then transactions should reconcile across all 3 accounts