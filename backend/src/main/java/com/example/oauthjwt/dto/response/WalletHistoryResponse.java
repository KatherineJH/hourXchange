package com.example.oauthjwt.dto.response;

import java.time.LocalDateTime;

import com.example.oauthjwt.entity.WalletHistory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WalletHistoryResponse {
    private Long id;
    private String type;
    private int amount;
    private int balance;
    private Long productId;
    private LocalDateTime createdAt;

    public static WalletHistoryResponse from(WalletHistory wh) {
        return WalletHistoryResponse.builder().id(wh.getId()).type(wh.getType().name()).amount(wh.getAmount())
                .balance(wh.getBalance()).productId(wh.getProduct().getId()).createdAt(wh.getCreatedAt()).build();
    }
}
