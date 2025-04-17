package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {}
