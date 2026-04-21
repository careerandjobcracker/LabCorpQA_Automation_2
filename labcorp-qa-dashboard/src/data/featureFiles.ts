export const GET_REQUEST_FEATURE = `Feature: GET Request Scenarios for Echo API

  Background:
    Given the base URI is configured for the Echo API

  @smoke @regression
  Scenario: Validate GET request returns 200 status code
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response body should contain a "path" field
    And the response body should contain an "ip" field
    And the response body "path" field should equal "/sample-request"

  @regression
  Scenario: Validate response headers are present in echoed response
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response headers object should not be empty
    And the response should contain header "Host"
    And the response should contain header "User-Agent"
    And the response should contain header "Accept"
    And the response should contain header "Accept-Encoding"

  @regression
  Scenario: Validate Content-Type header in GET response
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response Content-Type should contain "application/json"

  @regression
  Scenario: Validate IP field in GET response is a valid IPv4 address
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response "ip" field should match a valid IP address pattern

  @regression
  Scenario: Validate method field is GET in the response
    When I send a GET request to "/sample-request" with query param "author" as "beeceptor"
    Then the response body "method" field should equal "GET"

  @regression
  Scenario Outline: Validate query parameters are captured in the echoed response
    When I send a GET request to "/sample-request" with query param "author" as "<author>"
    Then the response query params should contain "author" with value "<author>"

    Examples:
      | author     |
      | beeceptor  |
      | testuser   |`;

export const POST_REQUEST_FEATURE = `Feature: POST Request Scenarios for Echo API

  Background:
    Given the base URI is configured for the Echo API
    And I have a valid order payload

  @smoke @regression
  Scenario: Validate POST request returns 200 and echoes the request body
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response status code should be 200
    And the response body should contain a "parsedBody" field

  @regression
  Scenario: Validate customer information in POST response
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the customer name should be "Jane Smith"
    And the customer email should be "janesmith@example.com"
    And the customer phone should be "1-987-654-3210"

  @regression
  Scenario: Validate customer address in POST response
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the customer address street should be "456 Oak Street"
    And the customer address city should be "Metropolis"
    And the customer address state should be "NY"
    And the customer address zipcode should be "10001"
    And the customer address country should be "USA"

  @regression
  Scenario: Validate payment information in POST response
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the payment method should be "credit_card"
    And the payment transaction id should be "txn_67890"
    And the payment amount should be 111.97
    And the payment currency should be "USD"

  @regression
  Scenario: Validate product items in POST response
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response should contain 2 items
    And item 1 product_id should be "A101"
    And item 1 name should be "Wireless Headphones"
    And item 1 quantity should be 1
    And item 1 price should be 79.99
    And item 2 product_id should be "B202"
    And item 2 name should be "Smartphone Case"
    And item 2 quantity should be 2
    And item 2 price should be 15.99

  @regression
  Scenario: Validate order metadata in POST response
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the order_id should be "12345"
    And the order_status should be "processing"
    And the created_at should be "2024-11-07T12:00:00Z"

  @regression
  Scenario: Validate shipping information in POST response
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the shipping method should be "standard"
    And the shipping cost should be 5.99
    And the shipping estimated delivery should be "2024-11-15"

  @regression
  Scenario: Validate Content-Type header in POST response
    When I send a POST request to "/sample-request" with query param "author" as "beeceptor"
    Then the response Content-Type should contain "application/json"`;

export const POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.qa</groupId>
  <artifactId>labcorp-qa-automation</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
    <rest-assured.version>5.4.0</rest-assured.version>
    <selenium.version>4.18.1</selenium.version>
    <cucumber.version>7.15.0</cucumber.version>
    <testng.version>7.9.0</testng.version>
    <jackson.version>2.16.1</jackson.version>
  </properties>

  <dependencies>
    <!-- REST Assured -->
    <dependency>
      <groupId>io.rest-assured</groupId>
      <artifactId>rest-assured</artifactId>
      <version>\${rest-assured.version}</version>
    </dependency>
    <dependency>
      <groupId>io.rest-assured</groupId>
      <artifactId>json-path</artifactId>
      <version>\${rest-assured.version}</version>
    </dependency>

    <!-- Selenium -->
    <dependency>
      <groupId>org.seleniumhq.selenium</groupId>
      <artifactId>selenium-java</artifactId>
      <version>\${selenium.version}</version>
    </dependency>

    <!-- Cucumber -->
    <dependency>
      <groupId>io.cucumber</groupId>
      <artifactId>cucumber-java</artifactId>
      <version>\${cucumber.version}</version>
    </dependency>
    <dependency>
      <groupId>io.cucumber</groupId>
      <artifactId>cucumber-testng</artifactId>
      <version>\${cucumber.version}</version>
    </dependency>
    <dependency>
      <groupId>io.cucumber</groupId>
      <artifactId>cucumber-picocontainer</artifactId>
      <version>\${cucumber.version}</version>
    </dependency>

    <!-- TestNG -->
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
      <version>\${testng.version}</version>
    </dependency>

    <!-- Jackson -->
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>\${jackson.version}</version>
    </dependency>

    <!-- Extent Reports -->
    <dependency>
      <groupId>com.aventstack</groupId>
      <artifactId>extentreports</artifactId>
      <version>5.1.1</version>
    </dependency>
  </dependencies>
</project>`;

export const PAYLOAD_BUILDER = `package com.qa.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import java.util.*;

public class PayloadBuilder {
  private static final ObjectMapper mapper = new ObjectMapper()
      .enable(SerializationFeature.INDENT_OUTPUT);

  public static Map<String, Object> buildOrderPayload() {
    Map<String, Object> payload = new LinkedHashMap<>();

    // Customer info
    Map<String, Object> customer = new LinkedHashMap<>();
    customer.put("name", "Jane Smith");
    customer.put("email", "janesmith@example.com");
    customer.put("phone", "1-987-654-3210");

    Map<String, Object> address = new LinkedHashMap<>();
    address.put("street", "456 Oak Street");
    address.put("city", "Metropolis");
    address.put("state", "NY");
    address.put("zipcode", "10001");
    address.put("country", "USA");
    customer.put("address", address);
    payload.put("customer", customer);

    // Items
    List<Map<String, Object>> items = new ArrayList<>();
    Map<String, Object> item1 = new LinkedHashMap<>();
    item1.put("product_id", "A101");
    item1.put("name", "Wireless Headphones");
    item1.put("quantity", 1);
    item1.put("price", 79.99);
    items.add(item1);

    Map<String, Object> item2 = new LinkedHashMap<>();
    item2.put("product_id", "B202");
    item2.put("name", "Smartphone Case");
    item2.put("quantity", 2);
    item2.put("price", 15.99);
    items.add(item2);
    payload.put("items", items);

    // Payment
    Map<String, Object> payment = new LinkedHashMap<>();
    payment.put("method", "credit_card");
    payment.put("transaction_id", "txn_67890");
    payment.put("amount", 111.97);
    payment.put("currency", "USD");
    payload.put("payment", payment);

    // Shipping
    Map<String, Object> shipping = new LinkedHashMap<>();
    shipping.put("method", "standard");
    shipping.put("cost", 5.99);
    shipping.put("estimated_delivery", "2024-11-15");
    payload.put("shipping", shipping);

    // Metadata
    payload.put("order_id", "12345");
    payload.put("order_status", "processing");
    payload.put("created_at", "2024-11-07T12:00:00Z");

    return payload;
  }

  public static String buildOrderPayloadAsJson() {
    try {
      return mapper.writeValueAsString(buildOrderPayload());
    } catch (Exception e) {
      throw new RuntimeException("Failed to serialize payload", e);
    }
  }
}`;
