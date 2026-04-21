package com.qa.runners;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

/**
 * Smoke-test runner — executes only scenarios tagged with {@code @smoke}.
 * Useful for fast sanity checks (CI gate, pre-deploy verifications, etc.).
 *
 * Run command:
 *   mvn test -Dtest=SmokeTestRunner
 */
@CucumberOptions(
        features  = "src/test/resources/features",
        glue      = {"com.qa.steps"},
        tags      = "@smoke",
        plugin    = {
                "pretty",
                "html:target/cucumber-reports/smoke-report.html",
                "json:target/cucumber-reports/smoke-report.json"
        },
        monochrome = true
)
public class SmokeTestRunner extends AbstractTestNGCucumberTests {
}
