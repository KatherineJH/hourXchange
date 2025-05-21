package com.example.oauthjwt.dto.request;

import com.example.oauthjwt.entity.Donation;
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
public class DonationHistoryRequest {
    private int amount; // 기부금액

    private Long donationId; // 기부모집 아이디

}
