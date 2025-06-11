package com.example.oauthjwt.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.document.DonationDocument;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationImage;
import com.example.oauthjwt.entity.type.DonationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private int viewCount; // 조회수

    private UserResponse author; // 작성자

    private String status; // 상태

    private List<String> images = new ArrayList<>(); // 이미지 리스트

    private String proofUrl;

    private LocalDateTime proofUploadedAt;

    public static DonationResponse toDto(Donation donation) {
        return DonationResponse.builder().id(donation.getId()).purpose(donation.getPurpose())
                .currentAmount(donation.getCurrentAmount()).targetAmount(donation.getTargetAmount())
                .title(donation.getTitle()).description(donation.getDescription()).startDate(donation.getStartDate())
                .endDate(donation.getEndDate()).createdAt(donation.getCreatedAt()).viewCount(donation.getViewCount())
                .author(UserResponse.toDto(donation.getAuthor()))
                .status(donation.getStatus().toString().equals(DonationStatus.ONGOING.toString()) ? "진행중"
                        : donation.getStatus().toString().equals(DonationStatus.ENDED.toString()) ? "종료"
                        : donation.getStatus().toString().equals(DonationStatus.COMPLETED.toString()) ? "완료"
                        : donation.getStatus().toString().equals(DonationStatus.CANCELLED.toString()) ? "취소" : "")
                .images(donation.getImages().stream().map(DonationImage::getImgUrl).collect(Collectors.toList()))
                .proofUrl(donation.getProofUrl())
                .proofUploadedAt(donation.getProofUploadedAt())
                .build();
    }

    public static DonationResponse toDto(DonationDocument donationDocument) {
        return DonationResponse.builder().id(donationDocument.getId()).purpose(donationDocument.getPurpose())
                .currentAmount(donationDocument.getCurrentAmount()).targetAmount(donationDocument.getTargetAmount())
                .title(donationDocument.getTitle()).description(donationDocument.getDescription())
                .startDate(donationDocument.getStartDate()).endDate(donationDocument.getEndDate())
                .createdAt(donationDocument.getCreatedAt()).viewCount(donationDocument.getViewCount())
                .author(donationDocument.getAuthor()).status(donationDocument.getStatus())
                .images(donationDocument.getImages()).build();
    }
}
