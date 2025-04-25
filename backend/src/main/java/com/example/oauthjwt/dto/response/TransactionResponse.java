package com.example.oauthjwt.dto.response;

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
public class TransactionResponse {
  private Long id;
  private UserResponse user;
  private ProductResponse product;
  private String status;
  private LocalDateTime createdAt;

  public static TransactionResponse toDto(Transaction transaction) {
    return TransactionResponse.builder()
        .id(transaction.getId())
        .user(UserResponse.toDto(transaction.getUser()))
        .product(ProductResponse.toDto(transaction.getProduct()))
        .status(transaction.getStatus().toString())
        .createdAt(transaction.getCreatedAt())
        .build();
  }
}
