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

    private String merchantUid;

    private String email;

    private String paymentItemName;

    private String paymentItemPrice;

    private String orderToken;

    public static PaymentOrderResponse toDto(Orders orders) {
        return PaymentOrderResponse.builder()
                .id(orders.getId())
                .merchantUid(orders.getMerchantUid())
                .email(orders.getEmail())
                .paymentItemName(orders.getPaymentItemName())
                .paymentItemPrice(orders.getPaymentItemPrice())
                .build();
    }
}
