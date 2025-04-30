package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;

public interface TransactionService {

  TransactionResponse save(TransactionRequest transactionRequest);

  TransactionResponse findById(Long id);

  List<TransactionResponse> findAll();

  List<TransactionResponse> findByUserId(Long userId);

  TransactionResponse update(TransactionRequest transactionRequest);
}
