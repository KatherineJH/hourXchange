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
public class PaymentVerifyRequest {
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "이메일 형식으로 입력하셔야합니다.")
    private String email;

    @NotBlank(message = "가맹점식별코드은 필수입니다.")
    private String impUid;

    @NotBlank(message = "토큰값은 필수입니다.")
    private String orderToken;

    @NotBlank(message = "상품이름은 필수입니다.")
    private String paymentItemName;

    @NotBlank(message = "상품가격은 필수입니다.")
    private String paymentItemPrice;
}
