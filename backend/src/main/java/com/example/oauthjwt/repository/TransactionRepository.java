package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.custom.TransactionRepositoryCustom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.Transaction;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, TransactionRepositoryCustom {
    Optional<Transaction> findByProduct(Product product);
    List<Transaction> findByUserId(Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.chatRoom.id = :chatRoomId")
    List<Transaction> findByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    // 고객 등급 분류
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId AND t.status = 'COMPLETED'")
    int countCompletedTransactions(@Param("userId") Long userId);
}
