package com.example.oauthjwt.entity;

public enum TRANSACTION_STATE {
    PENDING, // 시작 전
    COMPLETED, // 완료
    FAILED, // 실패
    REFUNDED // 환불
}
