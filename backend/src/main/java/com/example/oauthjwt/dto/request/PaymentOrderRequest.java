package com.example.oauthjwt.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderRequest {
    private String id;

    private String email;

    private String paymentItemName;

    private String paymentItemPrice;

    private String merchantUid;
}
