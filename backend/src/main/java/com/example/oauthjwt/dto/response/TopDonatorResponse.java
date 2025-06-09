package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopDonatorResponse {
    private UserResponse user;
    private int totalDonationTime;

    public static TopDonatorResponse toDto(User user, Integer totalDonationTime) {
        return TopDonatorResponse.builder().user(UserResponse.toDto(user)).totalDonationTime(totalDonationTime).build();
    }
}
