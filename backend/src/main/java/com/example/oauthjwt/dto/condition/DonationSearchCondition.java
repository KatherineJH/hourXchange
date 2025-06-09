package com.example.oauthjwt.dto.condition;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationSearchCondition {
    private Long donationId;
    private String title; // 제목
    private String description; // 설명
    private String status; // 상태
    private LocalDate startDate; // 시작일
    private LocalDate endDate; // 끝일
}
