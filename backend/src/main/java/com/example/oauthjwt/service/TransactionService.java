package com.example.oauthjwt.service;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;

@Service
public interface TransactionService {

  TransactionResponse createTransaction(TransactionRequest transactionRequest);
}
