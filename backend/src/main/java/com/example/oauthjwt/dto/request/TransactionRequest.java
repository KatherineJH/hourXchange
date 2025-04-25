package com.example.oauthjwt.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
  private Long id; // 트랜잭션 id

  private Long userId; // 대상 id 토큰에서 추출

  @NotNull(message = "제품 정보는 필수입니다.")
  private Long productId; // 대상 제품 id

  @NotBlank(message = "상태 정보는 필수입니다.")
  private String status; // 상태

  private LocalDateTime createAt;
}
