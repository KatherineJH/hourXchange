package com.example.oauthjwt.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {
  @NotBlank
  private String text; // 리뷰 텍스트

  @NotNull
  private Long productId; // 어떤 서비스에 대한 리뷰인지

  private Long transactionId;

  @Min(1)
  @Max(5)
  private Integer stars;
}
