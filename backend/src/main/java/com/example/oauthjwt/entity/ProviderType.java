package com.example.oauthjwt.entity;

import java.util.Collections;
import java.util.Map;

public enum ProviderType {
    SELLER, // 1
    BUYER; // 2

    public static Map<String, String> existsByValue(String statusInput) {
        try {
            ProviderType.valueOf(statusInput.toUpperCase());
        } catch (Exception e) {
            return Map.of("error", "존재하지 않는 타입입니다.");
        }
        return Collections.emptyMap();
    }
}
