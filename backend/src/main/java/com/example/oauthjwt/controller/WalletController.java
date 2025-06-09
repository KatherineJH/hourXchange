package com.example.oauthjwt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.service.WalletService;
import com.example.oauthjwt.service.impl.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/history")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<WalletHistoryResponse>> getMyWalletHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        List<WalletHistoryResponse> historyList = walletService.getWalletHistory(user.getId());
        return ResponseEntity.ok(historyList);
    }
}
