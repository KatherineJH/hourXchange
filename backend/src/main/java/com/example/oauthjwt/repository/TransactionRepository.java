package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.Transaction;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByProduct(Product product);
    List<Transaction> findByUserId(Long userId);
    Optional<Transaction> findByProductAndUser(Product product, User user);

    @Query("SELECT t FROM Transaction t WHERE t.product.id = :productId AND t.user.id IN :userIds")
    List<Transaction> findByProductIdAndUserIdIn(@Param("productId") Long productId, @Param("userIds") List<Long> userIds);

    @Query("SELECT t FROM Transaction t WHERE t.chatRoom.id = :chatRoomId")
    List<Transaction> findByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    // 고객 등급 분류
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId AND t.status = 'COMPLETED'")
    int countCompletedTransactions(@Param("userId") Long userId);
}
