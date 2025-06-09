package com.example.oauthjwt.dto.request;

import java.util.List;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true, message = "hours는 0 이상이어야 합니다.")
    @DecimalMax(value = "1.0", inclusive = false, message = "hours는 1 미만이어야 합니다.")
    private Double hours;

    private List<String> images;
}
