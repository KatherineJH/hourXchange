package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.TransactionUpdateRequest;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;

import java.util.List;
import java.util.Map;


public interface TransactionService {

  TransactionResponse createTransaction(TransactionRequest transactionRequest);

  Map<String, String> saveCheck(TransactionRequest transactionRequest);

  Map<String, String> existsById(Long id);

  TransactionResponse findById(Long id);
  List<TransactionResponse> findAll();

  TransactionResponse update(TransactionUpdateRequest transactionUpdateRequest);
}
