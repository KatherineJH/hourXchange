package com.example.oauthjwt.entity;

import com.example.oauthjwt.dto.request.PaymentOrderRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String impUid;

    @Column(nullable = false)
    private String merchantUid;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String paymentItemName;

    @Column(nullable = false)
    private String paymentItemPrice;

    public static Orders of(PaymentOrderRequest paymentOrderRequest, String impUid, String merchantUid) {
        return Orders.builder()
                .impUid(impUid)
                .merchantUid(merchantUid)
                .email(paymentOrderRequest.getEmail())
                .paymentItemName(paymentOrderRequest.getPaymentItemName())
                .paymentItemPrice(paymentOrderRequest.getPaymentItemPrice())
                .build();
    }
}
