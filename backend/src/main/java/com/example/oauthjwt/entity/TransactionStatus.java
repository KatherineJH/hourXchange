package com.example.oauthjwt.entity;

public enum TransactionStatus {
    PENDING, // 시작 전
    REQUESTED,
    ACCEPTED,
    COMPLETED, // 완료
    FAILED, // 실패
    REFUNDED; // 환불

    public static TransactionStatus parseTransactionType(String statusInput) {
        try {
            return TransactionStatus.valueOf(statusInput);
        } catch (Exception e) {
            return null;
        }
    }
}
