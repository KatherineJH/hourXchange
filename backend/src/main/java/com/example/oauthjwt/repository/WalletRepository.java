package com.example.oauthjwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUserId(Long userId);

    @Modifying
    @Query("UPDATE Wallet w SET w.credit = w.credit + :amount WHERE w.user.id = :userId")
    int addCredit(@Param("userId") Long userId, @Param("amount") int amount);
}
