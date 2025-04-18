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
  private TRANSACTION_STATE status;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  public Transaction setUpdateValue(TransactionUpdateRequest transactionUpdateRequest) {
    this.user = transactionUpdateRequest.getUser();
    this.product = transactionUpdateRequest.getServiceProduct();
    this.status = TRANSACTION_STATE.valueOf(transactionUpdateRequest.getTransactionState());
    this.createdAt = transactionUpdateRequest.getCreateAt();
    return this;
  }
}
