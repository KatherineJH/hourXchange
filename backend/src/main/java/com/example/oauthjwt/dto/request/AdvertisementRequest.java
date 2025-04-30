package com.example.oauthjwt.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdvertisementRequest {

    private Long id;

    private Long ownerId;

    private String title;

    private String description;

    @Min(1)
    private int hours;
}
