package com.example.oauthjwt.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationHistoryRequest {
    @Positive(message = "기부금액은 양수만 입력이 가능합니다.")
    private int amount; // 기부금액

    @NotNull(message = "기부모집 아이디 값은 필수입니다.")
    private Long donationId; // 기부모집 아이디

}
