@rest-api
Feature: ParaBank REST and SOAP API operations

  Background:
    Given the REST API customer payload is prepared

  Scenario: TC111 REST create customer
    When the customer is created through REST
    Then the REST response should be successful

  Scenario: TC112 REST retrieve customer
    When the customer is created through REST
    And the customer is retrieved through REST
    Then the REST customer response should match the customer schema

  Scenario: TC113 REST update customer
    When the customer is created through REST
    And the customer is updated through REST
    Then the REST response should be successful

  Scenario: TC114 REST delete customer
    When the customer is created through REST
    And the customer is deleted through REST
    Then the REST response should be successful

  Scenario: TC115 REST create/open account
    Given a REST customer exists
    When an account is created through REST
    Then the REST response should be successful

  Scenario: TC116 REST retrieve account
    Given a REST account exists
    When the account is retrieved through REST
    Then the REST account response should match the account schema

  Scenario: TC117 REST retrieve transactions
    Given a REST account exists
    When the account transactions are retrieved through REST
    Then the REST transaction response should be successful

  Scenario: TC118 REST perform transfer
    Given two REST accounts exist
    When a transfer is performed through REST
    Then the REST response should be successful

  Scenario: TC119 REST perform bill payment
    Given a REST account exists
    When a bill payment is performed through REST
    Then the REST response should be successful

  Scenario: TC120 REST invalid customer ID
    When an invalid customer ID is retrieved through REST
    Then the REST response should be rejected

  Scenario: TC121 REST invalid account ID
    When an invalid account ID is retrieved through REST
    Then the REST response should be rejected

  Scenario: TC122 REST malformed request payload
    When a malformed customer payload is submitted through REST
    Then the REST response should be rejected

  Scenario: TC123 REST missing required parameter
    When a customer payload missing a required parameter is submitted through REST
    Then the REST response should be rejected

  Scenario: TC124 REST wrong Content-Type
    When a customer request uses the wrong Content-Type
    Then the REST response should be rejected

  Scenario: TC125 REST invalid transfer amount
    Given two REST accounts exist
    When an invalid transfer amount is submitted through REST
    Then the REST response should be rejected

  Scenario: TC126 REST invalid bill-payment request
    Given a REST account exists
    When an invalid bill payment is submitted through REST
    Then the REST response should be rejected

  Scenario: TC127 Validate customer GET JSON schema
    Given a REST customer exists
    When the customer is retrieved through REST
    Then the REST customer response should match the customer schema

  Scenario: TC128 Validate account GET JSON schema
    Given a REST account exists
    When the account is retrieved through REST
    Then the REST account response should match the account schema

  Scenario: TC129 Validate transaction GET JSON schema
    Given a REST account exists
    When the account transactions are retrieved through REST
    Then the REST transaction response should match the transaction schema

  Scenario: TC130 SOAP equivalent of customer operation
    Given a REST customer exists
    When the customer is retrieved through SOAP
    Then the SOAP response should be successful