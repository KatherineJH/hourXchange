package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;

import java.util.List;

public interface WalletService {
    List<WalletHistoryResponse> getWalletHistory(Long userId);
}
