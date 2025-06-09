package com.example.oauthjwt.service.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;
import com.example.oauthjwt.entity.Wallet;
import com.example.oauthjwt.repository.WalletHistoryRepository;
import com.example.oauthjwt.repository.WalletRepository;
import com.example.oauthjwt.service.WalletService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletHistoryRepository walletHistoryRepository;

    @Override
    public List<WalletHistoryResponse> getWalletHistory(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "지갑 정보를 찾을 수 없습니다."));

        return walletHistoryRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId()).stream()
                .map(WalletHistoryResponse::from).toList();
    }
}
