Feature: ParaBank Registration

  @registration
  @smoke

  Scenario: Register a new customer with valid details
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    Then the customer should see the registration success message
    And the customer should be redirected and automatically logged in

  @registration
  @smoke
  Scenario: TC011 Registration with blank first name
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "first name" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC012 Registration with blank last name
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "last name" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC013 Registration with blank address
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "address" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC014 Registration with blank city
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "city" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC015 Registration with blank state
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "state" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC016 Registration with blank ZIP code
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "zip code" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC017 Registration with blank SSN
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "ssn" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC018 Registration with blank username
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "username" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC019 Registration with blank password
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "password" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC020 Registration with blank confirm password
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with the "confirm password" field blank
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC021 Registration with duplicate username
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers a duplicate username
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC022 Registration with password and confirm-password mismatch
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with a password mismatch
    Then the customer should see a registration validation error

  @registration
  @smoke
  Scenario: TC023 Registration with maximum-length name values
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with maximum-length name values
    Then the customer should see the registration success message

  @registration
  @smoke
  Scenario: TC024 Registration with special characters
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with special-character values
    Then the customer should see the registration success message

  @registration
  @smoke
  Scenario: TC025 Registration with SQL injection payload
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with an SQL injection payload
    Then the registration should not execute the payload

  @registration
  @smoke
  Scenario: TC026 Registration with XSS payload
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer submits registration with an XSS payload
    Then the registration should not execute the payload

  @registration
  @smoke
  Scenario: TC027 After logout, direct access to overview redirects to login
    Given the customer is on the ParaBank home page
    When the customer opens the registration page
    And the customer registers with valid details
    And the customer logs out and directly opens the Accounts Overview page
    Then the customer should be redirected to the login page