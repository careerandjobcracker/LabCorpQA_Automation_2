package com.qa.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * Builds the order payload for POST request tests.
 * Returns either a structured Map (serialisable by REST Assured/Jackson)
 * or a raw JSON String.
 */
public class PayloadBuilder {

    private static final Logger log      = LoggerFactory.getLogger(PayloadBuilder.class);
    private static final ObjectMapper om = new ObjectMapper();

    private PayloadBuilder() { }

    // ─────────────────────────────────────────────────────────────────────────
    // Public factory
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns the standard order payload as a nested {@code Map<String, Object>}.
     * REST Assured will serialise this to JSON automatically.
     */
    public static Map<String, Object> buildOrderPayload() {

        // ── address ──────────────────────────────────────────────────────────
        Map<String, Object> address = new LinkedHashMap<>();
        address.put("street",  "456 Oak Street");
        address.put("city",    "Metropolis");
        address.put("state",   "NY");
        address.put("zipcode", "10001");
        address.put("country", "USA");

        // ── customer ─────────────────────────────────────────────────────────
        Map<String, Object> customer = new LinkedHashMap<>();
        customer.put("name",    "Jane Smith");
        customer.put("email",   "janesmith@example.com");
        customer.put("phone",   "1-987-654-3210");
        customer.put("address", address);

        // ── items ────────────────────────────────────────────────────────────
        Map<String, Object> item1 = new LinkedHashMap<>();
        item1.put("product_id", "A101");
        item1.put("name",       "Wireless Headphones");
        item1.put("quantity",   1);
        item1.put("price",      79.99);

        Map<String, Object> item2 = new LinkedHashMap<>();
        item2.put("product_id", "B202");
        item2.put("name",       "Smartphone Case");
        item2.put("quantity",   2);
        item2.put("price",      15.99);

        List<Map<String, Object>> items = Arrays.asList(item1, item2);

        // ── payment ──────────────────────────────────────────────────────────
        Map<String, Object> payment = new LinkedHashMap<>();
        payment.put("method",         "credit_card");
        payment.put("transaction_id", "txn_67890");
        payment.put("amount",         111.97);
        payment.put("currency",       "USD");

        // ── shipping ─────────────────────────────────────────────────────────
        Map<String, Object> shipping = new LinkedHashMap<>();
        shipping.put("method",             "standard");
        shipping.put("cost",               5.99);
        shipping.put("estimated_delivery", "2024-11-15");

        // ── root ─────────────────────────────────────────────────────────────
        Map<String, Object> order = new LinkedHashMap<>();
        order.put("order_id",     "12345");
        order.put("customer",     customer);
        order.put("items",        items);
        order.put("payment",      payment);
        order.put("shipping",     shipping);
        order.put("order_status", "processing");
        order.put("created_at",   "2024-11-07T12:00:00Z");

        return order;
    }

    /**
     * Returns the standard order payload as a raw JSON {@code String}.
     */
    public static String buildOrderPayloadAsJson() {
        try {
            return om.writerWithDefaultPrettyPrinter()
                     .writeValueAsString(buildOrderPayload());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialise order payload", e);
            throw new RuntimeException("Failed to serialise order payload", e);
        }
    }
}
