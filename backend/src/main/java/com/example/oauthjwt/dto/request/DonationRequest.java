package com.example.oauthjwt.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationRequest {
    @NotBlank(message = "모집목적은 필수입니다.")
    private String purpose; // 모집목적
    @Positive(message = "모집목표액은 양수만 입력이 가능합니다.")
    private int targetAmount; // 모집목표액

    @NotBlank(message = "제목은 필수입니다.")
    private String title; // 제목

    @NotBlank(message = "설명은 필수입니다.")
    private String description; // 설명

    private LocalDate startDate; // 모집시작일

    private LocalDate endDate; // 모집끝일

    private List<String> images = new ArrayList<>(); // 이미지 url
}
