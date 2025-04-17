package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
