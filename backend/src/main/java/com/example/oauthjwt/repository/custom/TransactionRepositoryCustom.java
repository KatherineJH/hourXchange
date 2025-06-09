package com.example.oauthjwt.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.TransactionSearchCondition;
import com.example.oauthjwt.entity.Transaction;

public interface TransactionRepositoryCustom {
    Page<Transaction> search(TransactionSearchCondition condition, Pageable pageable);
}
