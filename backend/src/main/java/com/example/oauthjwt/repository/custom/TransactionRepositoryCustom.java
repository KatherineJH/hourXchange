package com.example.oauthjwt.repository.custom;

import com.example.oauthjwt.dto.condition.DonationSearchCondition;
import com.example.oauthjwt.dto.condition.TransactionSearchCondition;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionRepositoryCustom {
    Page<Transaction> search(TransactionSearchCondition condition, Pageable pageable);
}
