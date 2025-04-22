package com.example.oauthjwt.entity;

import java.time.LocalDateTime;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.request.TransactionUpdateRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Transaction {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", nullable = false)
  private ServiceProduct product;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private TransactionStatus status;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  public static Transaction of(TransactionRequest transactionRequest, User user, ServiceProduct product, TransactionStatus status) {
    return Transaction.builder()
            .user(user)
            .product(product)
            .status(status)
            .createdAt(LocalDateTime.now())
            .build();
  }

  public Transaction setUpdateValue(TransactionRequest transactionRequest, User user, ServiceProduct serviceProduct, TransactionStatus status) {
    this.user = user;
    this.product = serviceProduct;
    this.status = status;
    this.createdAt = transactionRequest.getCreateAt();
    return this;
  }
}
