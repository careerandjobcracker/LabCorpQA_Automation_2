package com.qa.utils;

import com.qa.config.ApiConfig;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.filter.log.LogDetail;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * Utility class that wraps REST Assured for reusable GET/POST operations.
 * All requests are pre-configured with logging and a shared base URI.
 */
public class RestAssuredHelper {

    private static final Logger log = LoggerFactory.getLogger(RestAssuredHelper.class);

    // ─────────────────────────────────────────────────────────────────────────
    // Shared Specifications
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Base request spec: sets base URI, content type, and enables full request logging.
     */
    public static RequestSpecification buildRequestSpec() {
        return new RequestSpecBuilder()
                .setBaseUri(ApiConfig.BASE_URI)
                .setContentType(ContentType.JSON)
                .log(LogDetail.ALL)
                .build();
    }

    /**
     * Base response spec: enables full response logging.
     */
    public static ResponseSpecification buildResponseSpec() {
        return new ResponseSpecBuilder()
                .log(LogDetail.ALL)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Sends a GET request to the given path with a single query parameter.
     *
     * @param path       relative path (e.g. "/sample-request")
     * @param paramName  query param key
     * @param paramValue query param value
     * @return REST Assured {@link Response}
     */
    public static Response sendGet(String path, String paramName, String paramValue) {
        log.info("→ GET  {} ?{}={}", path, paramName, paramValue);

        Response response = given()
                .spec(buildRequestSpec())
                .queryParam(paramName, paramValue)
                .when()
                .get(path)
                .then()
                .spec(buildResponseSpec())
                .extract()
                .response();

        log.info("← Status: {}", response.getStatusCode());
        return response;
    }

    /**
     * Sends a GET request with multiple query parameters.
     *
     * @param path        relative path
     * @param queryParams map of query param key/value pairs
     * @return REST Assured {@link Response}
     */
    public static Response sendGet(String path, Map<String, String> queryParams) {
        log.info("→ GET  {} params={}", path, queryParams);

        Response response = given()
                .spec(buildRequestSpec())
                .queryParams(queryParams)
                .when()
                .get(path)
                .then()
                .spec(buildResponseSpec())
                .extract()
                .response();

        log.info("← Status: {}", response.getStatusCode());
        return response;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Sends a POST request with a JSON body and a single query parameter.
     *
     * @param path       relative path
     * @param body       request body object (serialised to JSON via Jackson)
     * @param paramName  query param key
     * @param paramValue query param value
     * @return REST Assured {@link Response}
     */
    public static Response sendPost(String path, Object body, String paramName, String paramValue) {
        log.info("→ POST {} ?{}={}", path, paramName, paramValue);

        Response response = given()
                .spec(buildRequestSpec())
                .queryParam(paramName, paramValue)
                .body(body)
                .when()
                .post(path)
                .then()
                .spec(buildResponseSpec())
                .extract()
                .response();

        log.info("← Status: {}", response.getStatusCode());
        return response;
    }

    /**
     * Sends a POST request with a raw JSON string body and a single query parameter.
     *
     * @param path       relative path
     * @param jsonBody   raw JSON string
     * @param paramName  query param key
     * @param paramValue query param value
     * @return REST Assured {@link Response}
     */
    public static Response sendPost(String path, String jsonBody, String paramName, String paramValue) {
        log.info("→ POST {} ?{}={} (raw JSON body)", path, paramName, paramValue);

        Response response = given()
                .spec(buildRequestSpec())
                .queryParam(paramName, paramValue)
                .body(jsonBody)
                .when()
                .post(path)
                .then()
                .spec(buildResponseSpec())
                .extract()
                .response();

        log.info("← Status: {}", response.getStatusCode());
        return response;
    }
}
