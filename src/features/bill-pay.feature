@bill-pay
Feature: ParaBank bill payments

  Background:
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer prepares to pay a bill

  Scenario: TC063-TC065 Pay bill and verify confirmation and account debit
    When the customer pays the bill using valid payee information
    Then the bill-payment confirmation should be displayed
    And the bill-payment source account should be debited

  Scenario Outline: TC066-TC073 Pay bill with a required field blank
    When the customer pays the bill with the "<field>" field blank
    Then the bill payment should be rejected

    Examples:
      | field           |
      | payee name      |
      | address         |
      | city            |
      | state           |
      | ZIP code        |
      | phone number    |
      | account number  |
      | verify-account number |

  Scenario: TC074 Pay bill with blank amount
    When the customer pays the bill with a blank amount
    Then the bill payment should be rejected

  Scenario: TC075 Pay bill with amount 0.01
    When the customer pays the bill with amount "0.01"
    Then the bill-payment confirmation should be displayed

  Scenario: TC076 Pay bill with amount 0
    When the customer pays the bill with amount "0"
    Then the bill payment should be rejected

  Scenario: TC077 Pay bill with negative amount
    When the customer pays the bill with amount "-1"
    Then the bill payment should be rejected

  Scenario: TC078 Pay bill with amount greater than balance
    When the customer pays the bill with an amount greater than the source balance
    Then the bill payment should be rejected

  Scenario: TC079 Verify account-number/verify-account-number mismatch
    When the customer pays the bill with mismatched account numbers
    Then the bill payment should be rejected

  Scenario: TC080 Pay same biller twice and verify two debit entries
    When the customer pays the same bill twice with amount "1"
    Then two bill-payment debit entries should be recorded