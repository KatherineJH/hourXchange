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

    public static Advertisement toDto(Advertisement advertisement){
        return Advertisement.builder()
                .id(advertisement.getId())
                .title(advertisement.getTitle())
                .description(advertisement.getDescription())
                .hours(advertisement.getHours())
                .owner(advertisement.getOwner())
                .build();
    }
}
