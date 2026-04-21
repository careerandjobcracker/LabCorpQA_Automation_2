package com.qa.steps;

import com.qa.utils.PayloadBuilder;
import com.qa.utils.RestAssuredHelper;
import com.qa.utils.ScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;

/**
 * Step definitions for POST request feature scenarios.
 * Validates customer info, payment details, product items, and order metadata.
 */
public class PostRequestSteps {

    private static final Logger log = LoggerFactory.getLogger(PostRequestSteps.class);

    private final ScenarioContext context;

    public PostRequestSteps(ScenarioContext context) {
        this.context = context;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: root path into the echoed body
    // Beeceptor returns the parsed JSON body under the "parsedBody" key.
    // ─────────────────────────────────────────────────────────────────────────
    private String body(String jsonPath) {
        return "parsedBody." + jsonPath;
    }

    private String getString(String jsonPath) {
        return context.getResponse().jsonPath().getString(body(jsonPath));
    }

    private int getInt(String jsonPath) {
        return context.getResponse().jsonPath().getInt(body(jsonPath));
    }

    private float getFloat(String jsonPath) {
        return context.getResponse().jsonPath().getFloat(body(jsonPath));
    }

    private int getListSize(String jsonPath) {
        return context.getResponse().jsonPath().getList(body(jsonPath)).size();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Given
    // ─────────────────────────────────────────────────────────────────────────

    @Given("I have a valid order payload")
    public void iHaveAValidOrderPayload() {
        String payload = PayloadBuilder.buildOrderPayloadAsJson();
        context.setRequestPayload(payload);
        log.info("Order payload prepared:\n{}", payload);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // When
    // ─────────────────────────────────────────────────────────────────────────

    @When("I send a POST request to {string} with query param {string} as {string}")
    public void iSendAPostRequest(String path, String paramName, String paramValue) {
        Response response = RestAssuredHelper.sendPost(
                path,
                context.getRequestPayload(),
                paramName,
                paramValue
        );
        context.setResponse(response);
        log.info("POST response stored in context. Status={}", response.getStatusCode());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Then / And — Generic
    // ─────────────────────────────────────────────────────────────────────────

    @And("the response body should contain a {string} field")
    public void theResponseBodyShouldContainField(String field) {
        Object value = context.getResponse().jsonPath().get(field);
        log.info("Checking top-level field '{}' → value='{}'", field, value);
        Assert.assertNotNull(value,
                "Expected field '" + field + "' in the response body, but it was null.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Customer Info
    // ─────────────────────────────────────────────────────────────────────────

    @And("the response customer name should be {string}")
    public void customerNameShouldBe(String expected) {
        String actual = getString("customer.name");
        log.info("customer.name: expected='{}', actual='{}'", expected, actual);
        Assert.assertEquals(actual, expected, "Customer name mismatch!");
    }

    @And("the response customer email should be {string}")
    public void customerEmailShouldBe(String expected) {
        String actual = getString("customer.email");
        log.info("customer.email: expected='{}', actual='{}'", expected, actual);
        Assert.assertEquals(actual, expected, "Customer email mismatch!");
    }

    @And("the response customer phone should be {string}")
    public void customerPhoneShouldBe(String expected) {
        String actual = getString("customer.phone");
        log.info("customer.phone: expected='{}', actual='{}'", expected, actual);
        Assert.assertEquals(actual, expected, "Customer phone mismatch!");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Customer Address
    // ─────────────────────────────────────────────────────────────────────────

    @And("the response customer address street should be {string}")
    public void customerAddressStreetShouldBe(String expected) {
        Assert.assertEquals(getString("customer.address.street"), expected, "Address street mismatch!");
    }

    @And("the response customer address city should be {string}")
    public void customerAddressCityShouldBe(String expected) {
        Assert.assertEquals(getString("customer.address.city"), expected, "Address city mismatch!");
    }

    @And("the response customer address state should be {string}")
    public void customerAddressStateShouldBe(String expected) {
        Assert.assertEquals(getString("customer.address.state"), expected, "Address state mismatch!");
    }

    @And("the response customer address zipcode should be {string}")
    public void customerAddressZipcodeShouldBe(String expected) {
        Assert.assertEquals(getString("customer.address.zipcode"), expected, "Address zipcode mismatch!");
    }

    @And("the response customer address country should be {string}")
    public void customerAddressCountryShouldBe(String expected) {
        Assert.assertEquals(getString("customer.address.country"), expected, "Address country mismatch!");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Payment
    // ─────────────────────────────────────────────────────────────────────────

    @And("the response payment method should be {string}")
    public void paymentMethodShouldBe(String expected) {
        Assert.assertEquals(getString("payment.method"), expected, "Payment method mismatch!");
    }

    @And("the response payment transaction ID should be {string}")
    public void paymentTransactionIdShouldBe(String expected) {
        Assert.assertEquals(getString("payment.transaction_id"), expected, "Payment transaction_id mismatch!");
    }

    @And("the response payment amount should be {double}")
    public void paymentAmountShouldBe(double expected) {
        float actual = getFloat("payment.amount");
        log.info("payment.amount: expected={}, actual={}", expected, actual);
        Assert.assertEquals(actual, (float) expected, 0.01f, "Payment amount mismatch!");
    }

    @And("the response payment currency should be {string}")
    public void paymentCurrencyShouldBe(String expected) {
        Assert.assertEquals(getString("payment.currency"), expected, "Payment currency mismatch!");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Items / Products
    // ─────────────────────────────────────────────────────────────────────────

    @And("the response should contain {int} items")
    public void responseShouldContainItems(int expectedCount) {
        int actual = getListSize("items");
        log.info("items count: expected={}, actual={}", expectedCount, actual);
        Assert.assertEquals(actual, expectedCount, "Items count mismatch!");
    }

    @And("the first item product ID should be {string}")
    public void firstItemProductIdShouldBe(String expected) {
        Assert.assertEquals(getString("items[0].product_id"), expected, "First item product_id mismatch!");
    }

    @And("the first item name should be {string}")
    public void firstItemNameShouldBe(String expected) {
        Assert.assertEquals(getString("items[0].name"), expected, "First item name mismatch!");
    }

    @And("the first item quantity should be {int}")
    public void firstItemQuantityShouldBe(int expected) {
        Assert.assertEquals(getInt("items[0].quantity"), expected, "First item quantity mismatch!");
    }

    @And("the first item price should be {double}")
    public void firstItemPriceShouldBe(double expected) {
        float actual = getFloat("items[0].price");
        Assert.assertEquals(actual, (float) expected, 0.01f, "First item price mismatch!");
    }

    @And("the second item product ID should be {string}")
    public void secondItemProductIdShouldBe(String expected) {
        Assert.assertEquals(getString("items[1].product_id"), expected, "Second item product_id mismatch!");
    }

    @And("the second item name should be {string}")
    public void secondItemNameShouldBe(String expected) {
        Assert.assertEquals(getString("items[1].name"), expected, "Second item name mismatch!");
    }

    @And("the second item quantity should be {int}")
    public void secondItemQuantityShouldBe(int expected) {
        Assert.assertEquals(getInt("items[1].quantity"), expected, "Second item quantity mismatch!");
    }

    @And("the second item price should be {double}")
    public void secondItemPriceShouldBe(double expected) {
        float actual = getFloat("items[1].price");
        Assert.assertEquals(actual, (float) expected, 0.01f, "Second item price mismatch!");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Order Metadata
    // ─────────────────────────────────────────────────────────────────────────

    @And("the response order ID should be {string}")
    public void orderIdShouldBe(String expected) {
        Assert.assertEquals(getString("order_id"), expected, "order_id mismatch!");
    }

    @And("the response order status should be {string}")
    public void orderStatusShouldBe(String expected) {
        Assert.assertEquals(getString("order_status"), expected, "order_status mismatch!");
    }

    @And("the response created_at should be {string}")
    public void createdAtShouldBe(String expected) {
        Assert.assertEquals(getString("created_at"), expected, "created_at mismatch!");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Shipping
    // ─────────────────────────────────────────────────────────────────────────

    @And("the response shipping method should be {string}")
    public void shippingMethodShouldBe(String expected) {
        Assert.assertEquals(getString("shipping.method"), expected, "Shipping method mismatch!");
    }

    @And("the response shipping cost should be {double}")
    public void shippingCostShouldBe(double expected) {
        float actual = getFloat("shipping.cost");
        Assert.assertEquals(actual, (float) expected, 0.01f, "Shipping cost mismatch!");
    }

    @And("the response estimated delivery should be {string}")
    public void estimatedDeliveryShouldBe(String expected) {
        Assert.assertEquals(getString("shipping.estimated_delivery"), expected, "Estimated delivery mismatch!");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Content-Type (reused from GET steps via delegation)
    // ─────────────────────────────────────────────────────────────────────────

    @Then("the response Content-Type should contain {string}")
    public void contentTypeShouldContain(String expected) {
        String contentType = context.getResponse().getContentType();
        log.info("Content-Type: '{}'", contentType);
        Assert.assertNotNull(contentType, "Content-Type header is missing.");
        Assert.assertTrue(contentType.contains(expected),
                "Expected Content-Type to contain '" + expected + "' but got '" + contentType + "'.");
    }
}
