package com.qa.config;

/**
 * Centralized API configuration constants.
 * All endpoint URLs and static test data reside here.
 */
public class ApiConfig {

    private ApiConfig() {
        // Utility class — prevent instantiation
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Base URIs
    // ─────────────────────────────────────────────────────────────────────────
    public static final String BASE_URI = "https://echo.free.beeceptor.com";

    // ─────────────────────────────────────────────────────────────────────────
    // Endpoints
    // ─────────────────────────────────────────────────────────────────────────
    public static final String SAMPLE_REQUEST_PATH = "/sample-request";

    // ─────────────────────────────────────────────────────────────────────────
    // Query Parameters
    // ─────────────────────────────────────────────────────────────────────────
    public static final String AUTHOR_PARAM       = "author";
    public static final String AUTHOR_PARAM_VALUE = "beeceptor";

    // ─────────────────────────────────────────────────────────────────────────
    // Expected HTTP Status Codes
    // ─────────────────────────────────────────────────────────────────────────
    public static final int STATUS_OK = 200;

    // ─────────────────────────────────────────────────────────────────────────
    // Content Type
    // ─────────────────────────────────────────────────────────────────────────
    public static final String CONTENT_TYPE_JSON = "application/json";
}
