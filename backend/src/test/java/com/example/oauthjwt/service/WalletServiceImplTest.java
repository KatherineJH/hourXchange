package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.Wallet;
import com.example.oauthjwt.entity.WalletHistory;
import com.example.oauthjwt.entity.type.WalletATM;
import com.example.oauthjwt.repository.WalletHistoryRepository;
import com.example.oauthjwt.repository.WalletRepository;
import com.example.oauthjwt.service.impl.WalletServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class WalletServiceImplTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private WalletHistoryRepository walletHistoryRepository;

    @InjectMocks
    private WalletServiceImpl walletService;

    @Test
    void 지갑이_존재하면_히스토리_정상조회() {
        // given
        Long userId = 1L;
        User user = User.builder()
                .id(userId)
                .email("test@example.com")
                .build();

        Wallet wallet = Wallet.builder()
                .id(10L)
                .credit(100)
                .user(user)
                .build();

        WalletHistory history = WalletHistory.builder()
                .id(1L)
                .wallet(wallet)
                .type(WalletATM.EARN)  // 문자열 아님
                .amount(50)
                .createdAt(LocalDateTime.now())
                .build();

        given(walletRepository.findByUserId(userId)).willReturn(Optional.of(wallet));
        given(walletHistoryRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId()))
                .willReturn(List.of(history));

        // when
        List<WalletHistoryResponse> result = walletService.getWalletHistory(userId);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount()).isEqualTo(50);
        assertThat(result.get(0).getType()).isEqualTo(WalletATM.EARN.name());
    }

    @Test
    void 지갑이_없으면_예외발생() {
        // given
        Long userId = 2L;
        given(walletRepository.findByUserId(userId)).willReturn(Optional.empty());

        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            walletService.getWalletHistory(userId);
        });
    }
}
