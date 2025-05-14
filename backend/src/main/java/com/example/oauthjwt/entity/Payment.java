package com.example.oauthjwt.entity;

import jakarta.persistence.*;
import jakarta.persistence.criteria.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import java.util.UUID;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Log4j2
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String impUid;        // imp_uid

    @Column(nullable = false, unique = true)
    private String merchantUid;   // merchant_uid

    @Column(nullable = false)
    private int amount;       // 결제 금액

    @Column(nullable = false)
    private String status;        // paid, failed 등

    @Column(nullable = false)
    private LocalDateTime paidAt; // 결제 완료 시각

    @Column(nullable = false)
    private String payMethod;     // card, vbank 등

    @Column(nullable = false)
    private String pgProvider;    // html5_inicis, naverpay 등

    @Column(nullable = false, unique = true)
    private String pgTid;         // PG 거래번호

    @Column(nullable = false, unique = true)
    private String receiptUrl;    // 영수증 URL

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long paymentItemId;

    public static Payment of(Map payment, Long userId, Long paymentItemId) {
        return Payment.builder()
                .impUid((String) payment.get("imp_uid"))
                .merchantUid((String) payment.get("merchant_uid"))
                .amount((int) payment.get("amount"))
                .status((String) payment.get("status"))
                .paidAt(Instant.ofEpochSecond(((Number) payment.get("paid_at")).longValue())
                        .atZone(ZoneId.of("Asia/Seoul"))
                        .toLocalDateTime())
                .payMethod((String) payment.get("pay_method"))
                .pgProvider((String) payment.get("pg_provider"))
                .pgTid((String) payment.get("pg_tid"))
                .receiptUrl((String) payment.get("receipt_url"))
                .userId(userId)
                .paymentItemId(paymentItemId)
                .build();
    }

    public static Payment of(Orders orders, User user, PaymentItem paymentItem) {
        return Payment.builder()
                .impUid(orders.getImpUid())
                .merchantUid(orders.getMerchantUid())
                .amount(paymentItem.getPrice())
                .status("paid")
                .paidAt(LocalDateTime.now())
                .payMethod("hourXchangePay")
                .pgProvider("hourXchange")
                .pgTid(UUID.randomUUID().toString())
                .receiptUrl(UUID.randomUUID().toString())
                .userId(user.getId())
                .paymentItemId(paymentItem.getId())
                .build();
    }
}
