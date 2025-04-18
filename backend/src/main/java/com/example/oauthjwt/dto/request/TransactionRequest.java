package com.example.oauthjwt.dto.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
  private Long userId; // 대상 id
  private Long productId; // 대상 제품 id
  private String transactionState; // 상태
  private LocalDateTime createAt; // 생성일
}
