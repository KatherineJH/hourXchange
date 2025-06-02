package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.condition.TransactionSearchCondition;
import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface TransactionService {

    TransactionResponse save(TransactionRequest transactionRequest);

    TransactionResponse findById(Long id);

    Page<TransactionResponse> findAll(Pageable pageable);

    List<TransactionResponse> findByUserId(Long userId);

    TransactionResponse update(TransactionRequest transactionRequest);

    @Transactional
    void updateTransactionStatusToRequested(Long chatRoomId, Long requesterId);

    @Transactional
    void updateTransactionStatusToAccepted(Long chatRoomId);

    @Transactional
    void completeTransaction(Long transactionId);

    Page<TransactionResponse> search(Pageable pageable, TransactionSearchCondition transactionSearchCondition);
}
