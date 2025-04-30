package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Transaction;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByProduct(Product product);

    List<Transaction> findByUserId(Long userId);

}
