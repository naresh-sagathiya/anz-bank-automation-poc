Feature: ParaBank Login

  @login
  @smoke

  Scenario: Login with valid credentials

    Given the customer is on the ParaBank home page
    When the customer logs in using the shared test user
    And the customer logs out of ParaBank
    When the customer logs in to ParaBank using valid credentials
    Then the customer should see the Accounts Overview page

  @login
  @smoke

  Scenario: Login with invalid username
  
    When the customer logs in with an invalid username
    Then the customer should remain on the login page

  @login
  @smoke
  
  Scenario: Login with invalid password
  
    When the customer logs in with an invalid password
    Then the customer should remain on the login page

  @login
  @smoke
  
  Scenario: Login with blank username and password
  
    When the customer submits blank username and password
    Then the customer should remain on the login page

  @login
  @smoke
  
  Scenario: Logout successfully and verify login page
  
    When the customer logs in using the shared test user
    Then the customer should be logged out and see the login page