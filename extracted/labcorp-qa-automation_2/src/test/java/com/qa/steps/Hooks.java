package com.qa.steps;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Cucumber lifecycle hooks — executed before/after each scenario.
 * Handles logging, driver setup/teardown, and failure screenshots.
 */
public class Hooks {

    private static final Logger log = LoggerFactory.getLogger(Hooks.class);

    // ─────────────────────────────────────────────────────────────────────────
    // Before each scenario
    // ─────────────────────────────────────────────────────────────────────────

    @Before
    public void setUp(Scenario scenario) {
        log.info("══════════════════════════════════════════════════════");
        log.info("▶  SCENARIO STARTED : {}", scenario.getName());
        log.info("   Tags             : {}", scenario.getSourceTagNames());
        log.info("══════════════════════════════════════════════════════");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // After each scenario
    // ─────────────────────────────────────────────────────────────────────────

    @After
    public void tearDown(Scenario scenario) {
        String status = scenario.isFailed() ? "❌ FAILED" : "✅ PASSED";
        log.info("══════════════════════════════════════════════════════");
        log.info("■  SCENARIO ENDED   : {}", scenario.getName());
        log.info("   Result           : {}", status);
        log.info("══════════════════════════════════════════════════════");
    }
}
