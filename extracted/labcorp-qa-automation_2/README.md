# QA Automation Framework
> REST Assured · Java · Selenium · Cucumber BDD

---

## 📁 Project Structure

```
qa-automation/
├── pom.xml                                         # Maven dependencies & build config
├── testng.xml                                      # TestNG suite configuration
│
└── src/test/
    ├── java/com/qa/
    │   ├── config/
    │   │   └── ApiConfig.java                      # Base URIs, endpoints, constants
    │   │
    │   ├── utils/
    │   │   ├── RestAssuredHelper.java              # Reusable GET/POST wrappers
    │   │   ├── PayloadBuilder.java                 # Builds POST order payload
    │   │   └── ScenarioContext.java                # PicoContainer shared state
    │   │
    │   ├── steps/
    │   │   ├── CommonSteps.java                    # Background step (base URI setup)
    │   │   ├── GetRequestSteps.java                # GET feature step definitions
    │   │   ├── PostRequestSteps.java               # POST feature step definitions
    │   │   └── Hooks.java                          # Before/After scenario hooks
    │   │
    │   └── runners/
    │       ├── TestRunner.java                     # Full regression runner (@regression)
    │       └── SmokeTestRunner.java                # Smoke runner (@smoke)
    │
    └── resources/
        ├── cucumber.properties                     # Cucumber global config
        └── features/
            ├── GetRequest.feature                  # GET scenarios (BDD)
            └── PostRequest.feature                 # POST scenarios (BDD)
```

---

## ⚙️ Tech Stack

| Tool            | Version  | Purpose                              |
|-----------------|----------|--------------------------------------|
| Java            | 11+      | Language                             |
| Maven           | 3.8+     | Build & dependency management        |
| REST Assured    | 5.4.0    | API testing / HTTP client            |
| Selenium        | 4.18.1   | Browser automation (extensible)      |
| Cucumber        | 7.15.0   | BDD framework                        |
| TestNG          | 7.9.0    | Test execution engine                |
| Jackson         | 2.16.1   | JSON serialization/deserialization   |
| PicoContainer   | (via Cucumber) | Dependency injection          |
| Extent Reports  | 5.1.1    | Rich HTML test reports               |
| SLF4J           | 2.0.12   | Logging                              |

---

## 🧪 Test Coverage

### GET Request (`GetRequest.feature`)
| Scenario | What is Validated |
|----------|-------------------|
| Status Code | HTTP 200 returned |
| `path` field | Present and equals `/sample-request` |
| `ip` field | Present and matches valid IPv4 pattern |
| `method` field | Equals `GET` |
| Headers object | Not null, not empty |
| Specific headers | `Host`, `User-Agent`, `Accept`, `Accept-Encoding` present |
| Content-Type | Contains `application/json` |
| Query params echoed | `author=beeceptor` reflected in response |

### POST Request (`PostRequest.feature`)
| Scenario | What is Validated |
|----------|-------------------|
| Status Code | HTTP 200 returned |
| `parsedBody` present | Echo wraps body under `parsedBody` |
| Customer info | name, email, phone |
| Customer address | street, city, state, zipcode, country |
| Payment info | method, transaction_id, amount, currency |
| Product items | count (2), each item's product_id, name, quantity, price |
| Order metadata | order_id, order_status, created_at |
| Shipping | method, cost, estimated_delivery |
| Content-Type | Contains `application/json` |

---

## 🚀 How to Run

### Prerequisites
- Java 11 or above
- Maven 3.8+

### Run All Regression Tests
```bash
mvn test
```

### Run Smoke Tests Only
```bash
mvn test -Dtest=SmokeTestRunner
```

### Run by Tag
```bash
# Smoke scenarios
mvn test -Dcucumber.filter.tags="@smoke"

# Only GET scenarios
mvn test -Dcucumber.filter.tags="@get"

# Only POST scenarios
mvn test -Dcucumber.filter.tags="@post"

# All regression scenarios
mvn test -Dcucumber.filter.tags="@regression"
```

---

## 📊 Reports

After test execution, reports are generated in:

```
target/cucumber-reports/
├── cucumber.html       ← Full HTML report
├── cucumber.json       ← Machine-readable JSON
├── cucumber.xml        ← JUnit XML (for CI/CD)
└── rerun.txt           ← Rerun failed scenarios
```

To **rerun failed scenarios**:
```bash
mvn test -Dcucumber.features="@target/cucumber-reports/rerun.txt"
```

---

## 🏗️ Design Decisions

### PicoContainer for Dependency Injection
`ScenarioContext` is injected into all step-definition classes by PicoContainer. This allows the `Response` from a `When` step to be accessed cleanly in subsequent `Then`/`And` steps — even across different step classes — without static fields.

### Payload as Map
`PayloadBuilder` returns a `Map<String, Object>` rather than a POJO. This keeps the builder self-contained and avoids the need for a full order model hierarchy. REST Assured serialises it to JSON automatically.

### Echo API Response Path
Beeceptor's echo API wraps the request body under `parsedBody` in the JSON response. All POST assertions resolve paths relative to this key (e.g., `parsedBody.customer.name`).

---

## ✏️ Extending the Framework

1. **Add a new endpoint** → Update `ApiConfig.java` with the new path constant.
2. **Add a new scenario** → Add a `Scenario` block in the relevant `.feature` file.
3. **Add new step definitions** → Create a new `*Steps.java` class in `com.qa.steps`. Inject `ScenarioContext` via constructor.
4. **Add a new payload** → Add a builder method in `PayloadBuilder.java`.
