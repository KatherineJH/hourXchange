package com.example.oauthjwt.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.request.TransactionUpdateRequest;
import com.example.oauthjwt.service.ServiceProductService;
import com.example.oauthjwt.service.UserService;
import org.springframework.http.ResponseEntity;
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

  private final UserService userService;
  private final ServiceProductService serviceProductService;

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

  @Override
  public Map<String, String> saveCheck(TransactionRequest transactionRequest) {
    Map<String, String> userCheck = userService.existsById(transactionRequest.getUserId());
    if (!userCheck.isEmpty()) {
      return userCheck;
    }

    Map<String, String> productCheck =
            serviceProductService.existsById(transactionRequest.getProductId());
    if (!productCheck.isEmpty()) {
      return productCheck;
    }

    Map<String, String> TRANSACTION_STATECheck =
            TRANSACTION_STATE.existsByValue(transactionRequest.getTransactionState());
    if (!TRANSACTION_STATECheck.isEmpty()) {
      return TRANSACTION_STATECheck;
    }
    return Collections.emptyMap();
  }

  @Override
  public Map<String, String> existsById(Long id) {
    if(!transactionRepository.existsById(id)) {
      return Map.of("error", "해당 트랜잭션을 찾을 수 없습니다.");
    }
    return Collections.emptyMap();
  }

  @Override
  public TransactionResponse findById(Long id) {
    return TransactionResponse.toDto(transactionRepository.findById(id).get());
  }

  @Override
  public List<TransactionResponse> findAll() {
    return transactionRepository.findAll().stream().map(TransactionResponse::toDto).collect(Collectors.toList());
  }

  @Override
  public TransactionResponse update(TransactionUpdateRequest transactionUpdateRequest) {
    Transaction transaction = transactionRepository.findById(transactionUpdateRequest.getId()).get();

    transactionUpdateRequest.setUser(userRepository.findById(transactionUpdateRequest.getUserId()).get());
    transactionUpdateRequest.setServiceProduct(serviceProductRepository.findById(transactionUpdateRequest.getProductId()).get());

    Transaction result = transactionRepository.save(transaction.setUpdateValue(transactionUpdateRequest));
    return TransactionResponse.toDto(result);
  }
}
