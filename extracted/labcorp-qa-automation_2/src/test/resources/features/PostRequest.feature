@api @post
Feature: POST Request Validation - Order API
  As a QA Engineer
  I want to validate the POST endpoint of the Echo API
  So that I can ensure customer, payment, and product information is accurately submitted and reflected

  Background:
    Given the base URI is configured for the Echo API

  @smoke @regression
  Scenario: Validate POST request returns 200 and echoes back the request body
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response body should contain a "parsedBody" field

  @regression
  Scenario: Validate customer information in POST response
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response customer name should be "Jane Smith"
    And the response customer email should be "janesmith@example.com"
    And the response customer phone should be "1-987-654-3210"

  @regression
  Scenario: Validate customer address in POST response
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response customer address street should be "456 Oak Street"
    And the response customer address city should be "Metropolis"
    And the response customer address state should be "NY"
    And the response customer address zipcode should be "10001"
    And the response customer address country should be "USA"

  @regression
  Scenario: Validate payment information in POST response
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response payment method should be "credit_card"
    And the response payment transaction ID should be "txn_67890"
    And the response payment amount should be 111.97
    And the response payment currency should be "USD"

  @regression
  Scenario: Validate product items in POST response
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response should contain 2 items
    And the first item product ID should be "A101"
    And the first item name should be "Wireless Headphones"
    And the first item quantity should be 1
    And the first item price should be 79.99
    And the second item product ID should be "B202"
    And the second item name should be "Smartphone Case"
    And the second item quantity should be 2
    And the second item price should be 15.99

  @regression
  Scenario: Validate order metadata in POST response
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response order ID should be "12345"
    And the response order status should be "processing"
    And the response created_at should be "2024-11-07T12:00:00Z"

  @regression
  Scenario: Validate shipping information in POST response
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response shipping method should be "standard"
    And the response shipping cost should be 5.99
    And the response estimated delivery should be "2024-11-15"

  @regression
  Scenario: Validate POST request Content-Type header is set correctly
    Given I have a valid order payload
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response Content-Type should contain "application/json"
