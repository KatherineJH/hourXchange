package com.example.oauthjwt.dto.condition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationHistorySearchCondition {
    private Long donationHistoryId;
    private Long donationId;
    private Long donatorId;
    private LocalDate startDate; // 시작일
    private LocalDate endDate; // 끝일
}
