package com.example.oauthjwt.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationRequest {

    private String purpose; // 모집목적

    private int targetAmount; // 모집목표액

    private String title; // 제목

    private String description; // 설명

    private LocalDate startDate; // 모집시작일

    private LocalDate endDate; // 모집끝일
}
