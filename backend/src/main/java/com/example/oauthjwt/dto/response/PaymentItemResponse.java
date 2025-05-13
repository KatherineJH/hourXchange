package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.PaymentItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentItemResponse {
    private Long id;
    private String name; // 상품명
    private int time; // 시간
    private int price; // 가격

    public static PaymentItemResponse toDto(PaymentItem paymentItem) {
        return PaymentItemResponse.builder()
                .id(paymentItem.getId())
                .name(paymentItem.getName())
                .time(paymentItem.getTime())
                .price(paymentItem.getPrice())
                .build();
    }
}
