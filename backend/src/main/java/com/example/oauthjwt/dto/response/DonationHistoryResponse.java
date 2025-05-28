package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationHistory;
import com.example.oauthjwt.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationHistoryResponse {
    private Long id;

    private int amount; // 기부금액

    private int balance; // 변동 전 잔액

    private LocalDateTime createdAt; // 생성일자

    private DonationResponse donation;

    private UserResponse donator;

    private String period;
    private Integer count;
    private Double sum;

    public static DonationHistoryResponse toDto(DonationHistory donationHistory) {
        return DonationHistoryResponse.builder()
                .id(donationHistory.getId())
                .amount(donationHistory.getAmount())
                .balance(donationHistory.getBalance())
                .createdAt(donationHistory.getCreatedAt())
                .donation(DonationResponse.toDto(donationHistory.getDonation()))
                .donator(UserResponse.toDto(donationHistory.getDonator()))
                .build();
    }

    // 집계 데이터용
    public static DonationHistoryResponse toDto(String period, Integer count, Double sum) {
        return DonationHistoryResponse.builder()
                .period(period)
                .count(count)
                .sum(sum)
                .build();
    }
}
