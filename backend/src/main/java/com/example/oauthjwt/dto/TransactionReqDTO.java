package com.example.oauthjwt.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionReqDTO {
  private Long userId; // 대상 id
  private Long productId; // 대상 제품 id
  private String transactionState; // 상태
  private LocalDateTime createAt; // 생성일
}
