package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Advertisement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdvertisementResponse {
    private Long id;

    private String title;

    private String description;

    private Double hours;

    private Long ownerId;
    private String ownerName;

    private List<String> images;

    public static AdvertisementResponse toDto(Advertisement ad) {
        return AdvertisementResponse.builder()
                .id(ad.getId())
                .title(ad.getTitle())
                .description(ad.getDescription())
                .hours(ad.getHours())
                .ownerId(ad.getOwner().getId())
                .ownerName(ad.getOwner().getName())
                .images(ad.getImages())
                .build();
    }
}
