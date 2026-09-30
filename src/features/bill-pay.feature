@bill-pay
Feature: ParaBank bill payments

  Background:
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer prepares to pay a bill

  Rule: Successful bill payments

    Scenario: TC063-TC065 Pay a bill and verify the debit
      When the customer pays the bill using valid payee information
      Then the bill-payment confirmation should be displayed
      And the bill-payment source account should be debited

    Scenario: TC075 Submit a bill payment of 0.01
      When the customer pays the bill with amount "0.01"
      Then the bill-pay outcome should match the submitted amount

    Scenario: TC080 Submit the same bill twice and reconcile completed debits
      When the customer pays the same bill twice with amount "1"
      Then the source-account debits should match completed bill payments

  Rule: Bill payment validation

    Scenario Outline: TC066-TC073 Reject a payment with a required payee field blank
      When the customer pays the bill with the "<field>" field blank
      Then the bill payment should be rejected

      Examples:
        | field                  |
        | payee name             |
        | address                |
        | city                   |
        | state                  |
        | ZIP code               |
        | phone number           |
        | account number         |
        | verify-account number  |

    Scenario: TC074 Reject a payment with a blank amount
      When the customer pays the bill with a blank amount
      Then the bill payment should be rejected

    Scenario: TC076 Submit a bill payment with a zero amount
      When the customer pays the bill with amount "0"
      Then the bill-pay outcome should match the submitted amount

    Scenario: TC077 Submit a payment with a negative amount
      When the customer pays the bill with amount "-1"
      Then the bill-pay outcome should match the submitted amount

    Scenario: TC078 Submit a payment greater than the source balance
      When the customer pays the bill with an amount greater than the source balance
      Then the bill-pay outcome should match the submitted amount

    Scenario: TC079 Reject mismatched account numbers
      When the customer pays the bill with mismatched account numbers
      Then the bill payment should be rejected