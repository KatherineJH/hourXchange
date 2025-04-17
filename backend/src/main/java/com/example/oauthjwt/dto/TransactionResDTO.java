package com.example.oauthjwt.dto;

import java.time.LocalDateTime;

import com.example.oauthjwt.entity.Transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResDTO {
  private Long id;
  private UserResDTO user;
  private ServiceProductResDTO product;
  private String status;
  private LocalDateTime createdAt;

  public static TransactionResDTO toDto(Transaction transaction) {
    return TransactionResDTO.builder()
        .id(transaction.getId())
        .user(UserResDTO.toDto(transaction.getUser()))
        .product(ServiceProductResDTO.toDto(transaction.getProduct()))
        .status(transaction.getStatus().toString())
        .createdAt(transaction.getCreatedAt())
        .build();
  }
}
