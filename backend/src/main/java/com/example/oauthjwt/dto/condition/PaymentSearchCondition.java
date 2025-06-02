package com.example.oauthjwt.dto.condition;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSearchCondition {
    private Long paymentId;
    private Long userId;
    private Long paymentItemId;
    private String impUid;        // imp_uid
    private String merchantUid;   // merchant_uid
    private String status;        // paid, failed 등
    private String payMethod;     // card, vbank 등
    private String pgProvider;    // html5_inicis, naverpay 등
    private String pgTid;         // PG 거래번호
    private String receiptUrl;    // 영수증 URL
    private LocalDate startDate; // 시작일
    private LocalDate endDate; // 끝일
}
