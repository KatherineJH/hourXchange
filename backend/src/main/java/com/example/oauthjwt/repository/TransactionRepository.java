package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByProduct(Product product);
    List<Transaction> findByUserId(Long userId);
    Optional<Transaction> findByProductAndUser(Product product, User user);
}
