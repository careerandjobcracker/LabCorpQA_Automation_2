package com.qa.steps;

import com.qa.config.ApiConfig;
import com.qa.utils.ScenarioContext;
import io.cucumber.java.en.Given;
import io.restassured.RestAssured;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Step definitions shared across all feature files (e.g., Background steps).
 */
public class CommonSteps {

    private static final Logger log = LoggerFactory.getLogger(CommonSteps.class);

    // PicoContainer injects the shared context
    private final ScenarioContext context;

    public CommonSteps(ScenarioContext context) {
        this.context = context;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Background
    // ─────────────────────────────────────────────────────────────────────────

    @Given("the base URI is configured for the Echo API")
    public void theBaseURIIsConfiguredForTheEchoAPI() {
        RestAssured.baseURI = ApiConfig.BASE_URI;
        log.info("Base URI set to: {}", ApiConfig.BASE_URI);
    }
}
