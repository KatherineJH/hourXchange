package com.example.oauthjwt.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderRequest {
    @NotBlank(message = "제목은 필수입니다.")
    @Email(message = "이메일 형식으로 입력하셔야합니다.")
    private String email;

    @NotBlank(message = "상품이름은 필수입니다.")
    private String paymentItemName;

    @NotBlank(message = "상품가격은 필수입니다.")
    private String paymentItemPrice;

    @NotBlank(message = "주문번호은 필수입니다.")
    private String merchantUid;
}
