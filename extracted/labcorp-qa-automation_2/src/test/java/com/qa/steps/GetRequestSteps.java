package com.qa.steps;

import com.qa.config.ApiConfig;
import com.qa.utils.RestAssuredHelper;
import com.qa.utils.ScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;

import java.util.Map;
import java.util.regex.Pattern;

/**
 * Step definitions for GET request feature scenarios.
 */
public class GetRequestSteps {

    private static final Logger log = LoggerFactory.getLogger(GetRequestSteps.class);

    // IP v4 pattern: four octets 0-255
    private static final Pattern IPV4_PATTERN =
            Pattern.compile("^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$");

    private final ScenarioContext context;

    public GetRequestSteps(ScenarioContext context) {
        this.context = context;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // When
    // ─────────────────────────────────────────────────────────────────────────

    @When("I send a GET request to {string} with query param {string} as {string}")
    public void iSendAGetRequest(String path, String paramName, String paramValue) {
        Response response = RestAssuredHelper.sendGet(path, paramName, paramValue);
        context.setResponse(response);
        log.info("GET response stored in context. Status={}", response.getStatusCode());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Then / And
    // ─────────────────────────────────────────────────────────────────────────

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatus) {
        int actualStatus = context.getResponse().getStatusCode();
        log.info("Asserting status code: expected={}, actual={}", expectedStatus, actualStatus);
        Assert.assertEquals(actualStatus, expectedStatus,
                "Status code mismatch! Expected " + expectedStatus + " but got " + actualStatus);
    }

    @And("the response body should contain a {string} field")
    public void theResponseBodyShouldContainField(String field) {
        String value = context.getResponse().jsonPath().getString(field);
        log.info("Checking field '{}' → value='{}'", field, value);
        Assert.assertNotNull(value,
                "Expected field '" + field + "' to be present in the response body, but it was null.");
        Assert.assertFalse(value.trim().isEmpty(),
                "Expected field '" + field + "' to be non-empty.");
    }

    @And("the response body should contain an {string} field")
    public void theResponseBodyShouldContainAnField(String field) {
        // Delegates to the same logic — separate step text for readability ("a" vs "an")
        theResponseBodyShouldContainField(field);
    }

    @And("the response body {string} field should equal {string}")
    public void theResponseBodyFieldShouldEqual(String field, String expected) {
        String actual = context.getResponse().jsonPath().getString(field);
        log.info("Asserting field '{}': expected='{}', actual='{}'", field, expected, actual);
        Assert.assertEquals(actual, expected,
                "Field '" + field + "' mismatch! Expected '" + expected + "' but got '" + actual + "'.");
    }

    @And("the response headers object should not be empty")
    public void theResponseHeadersObjectShouldNotBeEmpty() {
        // The echo API mirrors request headers into a "headers" JSON object
        Map<String, Object> headers = context.getResponse().jsonPath().getMap("headers");
        log.info("Response 'headers' object: {}", headers);
        Assert.assertNotNull(headers, "Expected 'headers' object in response body to be present.");
        Assert.assertFalse(headers.isEmpty(), "Expected 'headers' object in response body to be non-empty.");
    }

    @And("the response should contain header {string}")
    public void theResponseShouldContainHeader(String headerName) {
        // The echo API mirrors all request headers under the "headers" JSON object
        Map<String, Object> headers = context.getResponse().jsonPath().getMap("headers");
        log.info("Checking for header '{}' in echoed headers: {}", headerName, headers);
        Assert.assertNotNull(headers,
                "Response 'headers' object is null; cannot check for header '" + headerName + "'.");
        Assert.assertTrue(headers.containsKey(headerName),
                "Expected header '" + headerName + "' to be present in the response headers object. " +
                "Available headers: " + headers.keySet());
    }

    @And("the response Content-Type should contain {string}")
    public void theResponseContentTypeShouldContain(String expected) {
        String contentType = context.getResponse().getContentType();
        log.info("Response Content-Type: '{}'", contentType);
        Assert.assertNotNull(contentType, "Content-Type header is missing from the response.");
        Assert.assertTrue(contentType.contains(expected),
                "Expected Content-Type to contain '" + expected + "' but got '" + contentType + "'.");
    }

    @And("the response {string} field should match a valid IP address pattern")
    public void theResponseFieldShouldMatchIpPattern(String field) {
        String ip = context.getResponse().jsonPath().getString(field);
        log.info("Validating IP address: '{}'", ip);
        Assert.assertNotNull(ip, "Field '" + field + "' is null in the response.");
        Assert.assertTrue(IPV4_PATTERN.matcher(ip).matches(),
                "'" + ip + "' does not match a valid IPv4 address pattern.");
    }

    @And("the response query params should contain {string} with value {string}")
    public void theResponseQueryParamsShouldContain(String paramName, String paramValue) {
        // Beeceptor echoes query params under "queryParams" or "parsedQueryParams"
        String actual = context.getResponse().jsonPath()
                .getString("queryParams." + paramName);
        if (actual == null) {
            // Fallback key used by some echo services
            actual = context.getResponse().jsonPath()
                    .getString("parsedQueryParams." + paramName);
        }
        log.info("Query param '{}' → actual='{}'", paramName, actual);
        Assert.assertNotNull(actual,
                "Query param '" + paramName + "' was not found in the response.");
        Assert.assertEquals(actual, paramValue,
                "Query param '" + paramName + "' mismatch! Expected '" + paramValue + "' but got '" + actual + "'.");
    }
}
