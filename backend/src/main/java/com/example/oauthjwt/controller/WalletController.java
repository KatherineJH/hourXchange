package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.service.CustomUserDetails;
import com.example.oauthjwt.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/history")
    public ResponseEntity<List<WalletHistoryResponse>> getMyWalletHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        List<WalletHistoryResponse> historyList = walletService.getWalletHistory(user.getId());
        return ResponseEntity.ok(historyList);
    }
}
