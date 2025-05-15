package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.WalletHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletHistoryRepository extends JpaRepository<WalletHistory, Long> {
}
