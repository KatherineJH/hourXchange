package com.example.oauthjwt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerifyRequest {
    private String email;
    private String impUid;
    private String orderToken;
    private String paymentName;
    private String paymentPrice;
}
