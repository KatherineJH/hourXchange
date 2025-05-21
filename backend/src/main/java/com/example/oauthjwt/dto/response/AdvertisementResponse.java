package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Advertisement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdvertisementResponse {
    private Long id;

    private String title;

    private String description;

    private int hours;

    private Long ownerId;
    private String ownerName;

    public static AdvertisementResponse toDto(Advertisement ad) {
        return AdvertisementResponse.builder()
                .id(ad.getId())
                .title(ad.getTitle())
                .description(ad.getDescription())
                .hours(ad.getHours())
                .ownerId(ad.getOwner().getId())
                .ownerName(ad.getOwner().getName())
                .build();
    }
}
