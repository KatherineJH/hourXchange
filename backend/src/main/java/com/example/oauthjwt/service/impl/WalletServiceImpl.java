package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;
import com.example.oauthjwt.entity.Wallet;
import com.example.oauthjwt.repository.WalletHistoryRepository;
import com.example.oauthjwt.repository.WalletRepository;
import com.example.oauthjwt.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletHistoryRepository walletHistoryRepository;

    @Override
    public List<WalletHistoryResponse> getWalletHistory(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("지갑이 존재하지 않습니다."));

        return walletHistoryRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId())
                .stream()
                .map(WalletHistoryResponse::from)
                .toList();
    }
}

