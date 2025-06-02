package com.example.oauthjwt.entity;

import com.example.oauthjwt.dto.request.DonationHistoryRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DonationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int amount; // 기부금액

    @Column(nullable = false)
    private int balance; // 변동 전 잔액

    @Column(nullable = false)
    private LocalDateTime createdAt; // 생성일자

    @JoinColumn(name = "donation_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Donation donation;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User donator;

    // 취소
    public static DonationHistory of(Donation donation, User user, Integer hours) {
        return DonationHistory.builder()
                .amount(-hours)
                .balance(user.getWallet().getCredit())
                .createdAt(LocalDateTime.now())
                .donation(donation)
                .donator(user)
                .build();
    }

    // 기부
    public static DonationHistory of(DonationHistoryRequest donationHistoryRequest, Donation donation, User donator) {
        return DonationHistory.builder()
                .amount(donationHistoryRequest.getAmount())
                .balance(donator.getWallet().getCredit())
                .createdAt(LocalDateTime.now())
                .donation(donation)
                .donator(donator)
                .build();
    }
}
