package com.example.oauthjwt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequest {
  @NotBlank
  private String zonecode; // 우편번호
  @NotBlank
  private String roadAddress; // 도로명주소
  @NotBlank
  private String jibunAddress; // 지번주소

  private String detailAddress; // 상세주소
}
