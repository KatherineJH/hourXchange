package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Orders;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderResponse {

    private Long id;

    private String merchantUid; // 주문번호

    private String impUid; // 결제번호

    private String email; // 이메일

    private String paymentItemName; // 제품이름

    private String paymentItemPrice; // 제품가격

    private String orderToken; // 주문시 발급 된 토큰

    public static PaymentOrderResponse toDto(Orders orders) {
        return PaymentOrderResponse.builder().id(orders.getId()).merchantUid(orders.getMerchantUid())
                .impUid(orders.getImpUid()).email(orders.getEmail()).paymentItemName(orders.getPaymentItemName())
                .paymentItemPrice(orders.getPaymentItemPrice()).build();
    }
}
