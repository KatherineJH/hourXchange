package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.TransactionReqDTO;
import com.example.oauthjwt.dto.TransactionResDTO;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface TransactionService {

    TransactionResDTO createTransaction(TransactionReqDTO transactionReqDTO);
}
