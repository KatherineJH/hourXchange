package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Payment;
import com.example.oauthjwt.entity.PaymentItem;
import com.example.oauthjwt.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long   id;
    private String merchantUid;   // 주문번호
    private String impUid;        // 결제번호
    private Integer amount;       // 결제 금액
    private String status;        // paid, failed 등
    private LocalDateTime paidAt; // 결제 완료 시각
    private String payMethod;     // card, vbank 등
    private String pgProvider;    // html5_inicis, naverpay 등
    private String pgTid;         // PG 거래번호
    private String receiptUrl;    // 영수증 URL
    private UserResponse user;
    private PaymentItemResponse paymentItem;

    public static PaymentResponse toDto(Payment payment, User user, PaymentItem paymentItem) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .impUid(payment.getImpUid())
                .merchantUid(payment.getMerchantUid())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paidAt(payment.getPaidAt())
                .payMethod(payment.getPayMethod())
                .pgProvider(payment.getPgProvider())
                .pgTid(payment.getPgTid())
                .receiptUrl(payment.getReceiptUrl())
                .user(UserResponse.toDto(user))
                .paymentItem(PaymentItemResponse.toDto(paymentItem))
                .build();
    }
}
