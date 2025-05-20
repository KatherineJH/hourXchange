package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationResponse {

    private Long id;

    private String purpose; // 모집목적

    private int currentAmount; // 모집목표액

    private int targetAmount; // 모집목표액

    private String title; // 제목

    private String description; // 설명

    private LocalDate startDate; // 모집시작일

    private LocalDate endDate; // 모집끝일

    private LocalDateTime createdAt; // 생성일자

    private String status; // 상태

    private List<String> images= new ArrayList<>();

    public static DonationResponse toDto(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .purpose(donation.getPurpose())
                .currentAmount(donation.getCurrentAmount())
                .targetAmount(donation.getTargetAmount())
                .title(donation.getTitle())
                .description(donation.getDescription())
                .startDate(donation.getStartDate())
                .endDate(donation.getEndDate())
                .createdAt(donation.getCreatedAt())
                .status(donation.getStatus().toString().equals("ONGOING") ? "진행중" :
                        donation.getStatus().toString().equals("COMPLETE") ? "완료" : "취소")
                .images(donation.getImages().stream()
                        .map(DonationImage::getImgUrl)
                        .collect(Collectors.toList()))
                .build();
    }
}
