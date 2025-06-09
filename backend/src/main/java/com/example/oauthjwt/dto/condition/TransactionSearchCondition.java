package com.example.oauthjwt.dto.condition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionSearchCondition {
    private Long transactionId;
    private Long userId;
    private Long productId;
    private String status;
    private LocalDate startDate; // 시작일
    private LocalDate endDate; // 끝일
}
