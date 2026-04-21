@api @get
Feature: GET Request Validation - Echo API
  As a QA Engineer
  I want to validate the GET endpoint of the Echo API
  So that I can ensure the response structure, path, IP, and headers are correct

  Background:
    Given the base URI is configured for the Echo API

  @smoke @regression
  Scenario: Validate GET request returns 200 and correct response body
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response body should contain a "path" field
    And the response body should contain an "ip" field
    And the response body "path" field should equal "/sample-request"

  @regression
  Scenario: Validate all required headers are present in GET response
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response headers object should not be empty
    And the response should contain header "Host"
    And the response should contain header "User-Agent"
    And the response should contain header "Accept"
    And the response should contain header "Accept-Encoding"

  @regression
  Scenario: Validate GET response headers have correct content type
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response Content-Type should contain "application/json"

  @regression
  Scenario: Validate GET request IP field is a valid IPv4 address
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response "ip" field should match a valid IP address pattern

  @regression
  Scenario: Validate GET response method field reflects GET
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response body should contain a "method" field
    And the response body "method" field should equal "GET"

  @regression
  Scenario Outline: Validate GET response query params are captured
    When I send a GET request to "/sample-request" with query param "<paramName>" as "<paramValue>"
    Then the response status code should be 200
    And the response query params should contain "<paramName>" with value "<paramValue>"

    Examples:
      | paramName | paramValue |
      | author    | beeceptor  |
      | author    | testuser   |
