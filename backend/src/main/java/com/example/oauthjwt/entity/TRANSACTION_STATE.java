package com.example.oauthjwt.entity;

import java.util.Collections;
import java.util.Map;

public enum TRANSACTION_STATE {
    PENDING, // 시작 전
    COMPLETED, // 완료
    FAILED, // 실패
    REFUNDED; // 환불

    public static Map<String, String> existsByValue(String statusInput) {
        try {
            TRANSACTION_STATE.valueOf(statusInput.toUpperCase());
        } catch (Exception e) {
            return Map.of("error", "존재하지 않는 타입입니다.");
        }
        return Collections.emptyMap();
    }
}
