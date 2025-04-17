package com.example.oauthjwt.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.entity.ServiceProduct;
import com.example.oauthjwt.entity.TRANSACTION_STATE;
import com.example.oauthjwt.entity.Transaction;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.ServiceProductRepository;
import com.example.oauthjwt.repository.TransactionRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
  private final UserRepository userRepository;
  private final ServiceProductRepository serviceProductRepository;
  private final TransactionRepository transactionRepository;

  @Override
  public TransactionResponse createTransaction(TransactionRequest transactionRequest) {
    User user = userRepository.findById(transactionRequest.getUserId()).get();
    ServiceProduct serviceProduct =
        serviceProductRepository.findById(transactionRequest.getProductId()).get();

    Transaction transaction =
        Transaction.builder()
            .user(user)
            .product(serviceProduct)
            .status(
                TRANSACTION_STATE.valueOf(transactionRequest.getTransactionState().toUpperCase()))
            .createdAt(LocalDateTime.now())
            .build();

    Transaction result = transactionRepository.save(transaction);

    return TransactionResponse.toDto(result);
  }
}
