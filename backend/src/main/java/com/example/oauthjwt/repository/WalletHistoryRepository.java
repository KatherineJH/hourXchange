package com.example.oauthjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.WalletHistory;

public interface WalletHistoryRepository extends JpaRepository<WalletHistory, Long> {
    List<WalletHistory> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}
