package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Orders;
import com.example.oauthjwt.entity.Payment;
import com.example.oauthjwt.entity.PaymentItem;
import com.example.oauthjwt.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerifyResponse {

    private Long id;

    private String impUid;

    private String merchantUid;

    private String email;

    private String paymentItemName;

    private String paymentItemPrice;

    private PaymentResponse payment;

    public static PaymentVerifyResponse toDto(Orders orders, User user, Payment payment, PaymentItem paymentItem) {
        return PaymentVerifyResponse.builder().id(orders.getId()).impUid(orders.getImpUid())
                .merchantUid(orders.getMerchantUid()).email(orders.getEmail())
                .paymentItemName(orders.getPaymentItemName()).paymentItemPrice(orders.getPaymentItemPrice())
                .payment(PaymentResponse.toDto(payment, user, paymentItem)).build();
    }

}
