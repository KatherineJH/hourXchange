package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.WalletHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletHistoryRepository extends JpaRepository<WalletHistory, Long> {
    List<WalletHistory> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}
