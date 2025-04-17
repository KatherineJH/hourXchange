package com.example.oauthjwt.service;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.TransactionReqDTO;
import com.example.oauthjwt.dto.TransactionResDTO;

@Service
public interface TransactionService {

  TransactionResDTO createTransaction(TransactionReqDTO transactionReqDTO);
}
