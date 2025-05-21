package com.example.oauthjwt.entity;

import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.entity.type.DonationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String purpose; // 모집목적

    @Column(nullable = false)
    private int currentAmount; // 현재모집목표액

    @Column(nullable = false)
    private int targetAmount; // 모집목표액

    @Column(nullable = false)
    private String title; // 제목

    @Column(nullable = false)
    private String description; // 설명

    @Column(nullable = false)
    private LocalDate startDate; // 모집시작일

    @Column(nullable = false)
    private LocalDate endDate; // 모집끝일

    @Column(nullable = false)
    private LocalDateTime createdAt; // 생성일자

    @Column(nullable = false)
    private int viewCount; // 조회수

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    @Builder.Default
    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationImage> images = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationHistory> donationHistoryList = new ArrayList<>();

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    public static Donation of(DonationRequest donationRequest, User user) {
        return Donation.builder()
                .purpose(donationRequest.getPurpose())
                .currentAmount(0)
                .targetAmount(donationRequest.getTargetAmount())
                .title(donationRequest.getTitle())
                .description(donationRequest.getDescription())
                .startDate(donationRequest.getStartDate())
                .endDate(donationRequest.getEndDate())
                .createdAt(LocalDateTime.now())
                .viewCount(0)
                .status(DonationStatus.ONGOING)
                .author(user)
                .build();
    }

    public Donation setUpdateValue(DonationRequest donationRequest) {
        this.purpose = donationRequest.getPurpose();
        this.targetAmount = donationRequest.getTargetAmount();
        this.title = donationRequest.getTitle();
        this.description = donationRequest.getDescription();
        this.startDate = donationRequest.getStartDate();
        this.endDate = donationRequest.getEndDate();
        return this;
    }

    public Donation setDelete() {
        this.status = DonationStatus.CANCELLED;
        this.currentAmount = 0;
        return this;
    }

    public void addTime(int amount) {
        this.currentAmount += amount;
    }

    public Donation addViewCount(){
        this.viewCount++;
        return this;
    }
}
