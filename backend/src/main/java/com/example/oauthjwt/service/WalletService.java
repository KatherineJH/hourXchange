package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;

public interface WalletService {
    List<WalletHistoryResponse> getWalletHistory(Long userId);
}
