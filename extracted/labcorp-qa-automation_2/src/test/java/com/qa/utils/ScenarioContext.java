package com.qa.utils;

import io.restassured.response.Response;

/**
 * Shared context object injected by PicoContainer into step-definition classes.
 * Holds state that must be shared across multiple step classes within the same scenario.
 */
public class ScenarioContext {

    /** The REST Assured response from the most recent API call. */
    private Response response;

    /** The request payload (JSON string) used in the most recent POST. */
    private String requestPayload;

    // ─── response ────────────────────────────────────────────────────────────

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    // ─── requestPayload ──────────────────────────────────────────────────────

    public String getRequestPayload() {
        return requestPayload;
    }

    public void setRequestPayload(String requestPayload) {
        this.requestPayload = requestPayload;
    }
}
