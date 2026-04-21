package com.qa.runners;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

/**
 * TestNG runner that executes all Cucumber feature files.
 * Reports are generated in both Pretty (console) and HTML/JSON formats.
 *
 * Run command:
 *   mvn test -Dcucumber.filter.tags="@smoke"        (smoke only)
 *   mvn test -Dcucumber.filter.tags="@regression"   (full regression)
 *   mvn test                                         (all scenarios)
 */
@CucumberOptions(
        features  = "src/test/resources/features",
        glue      = {"com.qa.steps"},
        tags      = "@regression",
        plugin    = {
                "pretty",
                "html:target/cucumber-reports/cucumber.html",
                "json:target/cucumber-reports/cucumber.json",
                "junit:target/cucumber-reports/cucumber.xml",
                "rerun:target/cucumber-reports/rerun.txt"
        },
        monochrome = true,
        dryRun     = false
)
public class TestRunner extends AbstractTestNGCucumberTests {

    /**
     * Enables parallel execution of scenarios when running with TestNG.
     * Set parallel = true to run each scenario in its own thread.
     */
    @Override
    @DataProvider(parallel = false)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
