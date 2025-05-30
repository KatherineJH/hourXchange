package com.example.oauthjwt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationHistoryRequest {
    private int amount; // 기부금액

    private Long donationId; // 기부모집 아이디

}
