package com.example.oauthjwt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/meta")
public class CommonController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Set<String> allowedTables = Set.of(
            "address", "advertisement", "board", "boardimage", "category",
            "chat_messages", "chat_room_users", "chat_rooms", "comment", "donation",
            "donationhistory", "donationimage", "favorite", "orders", "payment",
            "paymentitem", "product", "review", "reviewtag", "serviceproduct",
            "spimage", "thumbsup", "transaction", "user", "visitlog",
            "wallet", "wallethistory"
    );

    @GetMapping("/row")
    public Map<String, Object> getFirstOrLastRow(
            @RequestParam String table,
            @RequestParam String position
    ) {
        if (!allowedTables.contains(table.toLowerCase())) {
            throw new IllegalArgumentException("Invalid table name.");
        }

        if (!position.equalsIgnoreCase("first") && !position.equalsIgnoreCase("last")) {
            throw new IllegalArgumentException("Position must be 'first' or 'last'.");
        }

        String order = position.equalsIgnoreCase("first") ? "ASC" : "DESC";

        String query = String.format("SELECT * FROM %s ORDER BY id %s LIMIT 1", table, order);

        List<Map<String, Object>> result = jdbcTemplate.queryForList(query);

        return result.isEmpty() ? Map.of() : result.get(0);
    }
}
