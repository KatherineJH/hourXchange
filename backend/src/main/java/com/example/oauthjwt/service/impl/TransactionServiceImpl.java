package com.example.oauthjwt.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.request.TransactionUpdateRequest;
import com.example.oauthjwt.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.entity.ServiceProduct;
import com.example.oauthjwt.entity.TransactionStatus;
import com.example.oauthjwt.entity.Transaction;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.ServiceProductRepository;
import com.example.oauthjwt.repository.TransactionRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.TransactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
  private final UserRepository userRepository;
  private final ServiceProductRepository serviceProductRepository;
  private final TransactionRepository transactionRepository;

  private final UserService userService;

  @Override
  public TransactionResponse save(TransactionRequest transactionRequest) {
    // 검증
    User user = userRepository.findById(transactionRequest.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
    ServiceProduct serviceProduct = serviceProductRepository.findById(transactionRequest.getProductId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품 정보가 존재하지 않습니다."));
    TransactionStatus transactionStatus = TransactionStatus.parseTransactionType(transactionRequest.getTransactionStatus().toUpperCase());
    if(transactionStatus == null){
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
    }
    // 엔티티 생성
    Transaction transaction = Transaction.of(transactionRequest, user, serviceProduct, transactionStatus);
    // 저장 및 반환
    Transaction result = transactionRepository.save(transaction);
    return TransactionResponse.toDto(result);
  }

  @Override
  public TransactionResponse findById(Long id) {
    Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "트랜잭션 정보가 존재하지 않습니다."));;
    return TransactionResponse.toDto(transaction);
  }

  @Override
  public List<TransactionResponse> findAll() {
    return transactionRepository.findAll().stream().map(TransactionResponse::toDto).collect(Collectors.toList());
  }

  @Override
  public TransactionResponse update(TransactionRequest transactionRequest) {
    // 검증
    Transaction transaction = transactionRepository.findById(transactionRequest.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "트랜잭션 정보가 존재하지 않습니다."));
    User user = userRepository.findById(transactionRequest.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
    ServiceProduct serviceProduct = serviceProductRepository.findById(transactionRequest.getProductId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품 정보가 존재하지 않습니다."));
    // 값 업데이트
    TransactionStatus transactionStatus = TransactionStatus.parseTransactionType(transactionRequest.getTransactionStatus().toUpperCase());
    // 저장 및 반환
    Transaction result = transactionRepository.save(transaction.setUpdateValue(transactionRequest, user, serviceProduct, transactionStatus));
    return TransactionResponse.toDto(result);
  }
}
