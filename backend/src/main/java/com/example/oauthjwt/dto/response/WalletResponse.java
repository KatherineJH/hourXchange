package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Wallet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletResponse {
    private Long id;

    private int credit;

    public static WalletResponse toDto(Wallet wallet) {
        if (wallet == null)
            return null;

        return WalletResponse.builder().id(wallet.getId()).credit(wallet.getCredit()).build();
    }
}
