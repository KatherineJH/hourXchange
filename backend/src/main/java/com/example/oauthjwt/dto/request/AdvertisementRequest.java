package com.example.oauthjwt.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "작성자는 필수입니다.")
    private Long ownerId;

    private String title;

    private String description;

    @Min(1)
    private int hours;
}
