@loan
Feature: ParaBank loan applications

  Background:
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer prepares to apply for a loan

  Scenario: TC096-TC098 Apply for a loan and verify its decision and account
    When the customer applies for a loan with valid amount and down payment
    Then the loan decision should be displayed
    And the approved loan account should appear when the loan is approved

  Scenario: TC099-TC100 Down payment exceeds balance and loan is denied
    When the customer applies for a loan with a down payment exceeding the balance
    Then the loan should be denied

  Scenario: TC101 Loan amount equals zero
    When the customer applies for a loan with amount "0"
    Then the loan should be denied

  Scenario: TC102 Loan amount is negative
    When the customer applies for a loan with amount "-1"
    Then the loan should be denied

  Scenario: TC103 Loan amount is blank
    When the customer applies for a loan with a blank amount
    Then the loan should be denied

  Scenario: TC104 Loan amount is non-numeric
    When the customer applies for a loan with amount "abc"
    Then the loan should be denied

  Scenario: TC105 Down payment equals loan amount and exceeds available funds
    When the customer applies for a loan with down payment equal to the loan amount
    Then the loan should be denied

  Scenario Outline: TC106-TC109 Execute approval-matrix scenario
    When the customer applies for an approval-matrix loan with amount "<amount>" and down payment "<downPayment>"
    Then the loan decision should be displayed

    Examples:
      | amount | downPayment |
      | 1000   | 100         |
      | 5000   | 500         |
      | 10000  | 1000        |
      | 25000  | 2500        |

  Scenario: TC110 Transfer funds only when a loan is approved
    When the customer applies for a loan with valid amount and down payment
    And the customer transfers funds from the approved loan account
    Then the loan transfer outcome should match the loan decision