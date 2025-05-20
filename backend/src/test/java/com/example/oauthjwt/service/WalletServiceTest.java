package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.Wallet;
import com.example.oauthjwt.entity.WalletHistory;
import com.example.oauthjwt.entity.type.WalletATM;
import com.example.oauthjwt.repository.WalletHistoryRepository;
import com.example.oauthjwt.repository.WalletRepository;
import com.example.oauthjwt.service.impl.WalletServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class WalletServiceTest {

    private WalletRepository walletRepository;
    private WalletHistoryRepository walletHistoryRepository;
    private WalletService walletService;

    @BeforeEach
    void setUp() {
        walletRepository = mock(WalletRepository.class);
        walletHistoryRepository = mock(WalletHistoryRepository.class);
        walletService = new WalletServiceImpl(walletRepository, walletHistoryRepository);
    }

    @Test
    @DisplayName("지갑 내역 조회 성공")
    void getWalletHistory_success() {
        // given
        Long userId = 1L;
        Wallet wallet = Wallet.builder().id(10L).build();
        Product product = Product.builder().id(100L).title("테니스 교습").build();

        WalletHistory history1 = WalletHistory.builder()
                .id(1L)
                .wallet(wallet)
                .type(WalletATM.EARN)
                .amount(10)
                .balance(110)
                .createdAt(LocalDateTime.now())
                .product(product)
                .build();

        WalletHistory history2 = WalletHistory.builder()
                .id(2L)
                .wallet(wallet)
                .type(WalletATM.SPEND)
                .amount(5)
                .balance(105)
                .createdAt(LocalDateTime.now().minusDays(1))
                .product(product)
                .build();

        when(walletRepository.findByUserId(userId)).thenReturn(Optional.of(wallet));
        when(walletHistoryRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId()))
                .thenReturn(List.of(history1, history2));

        // when
        List<WalletHistoryResponse> result = walletService.getWalletHistory(userId);

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getType()).isEqualTo(WalletATM.EARN.name());
        assertThat(result.get(0).getAmount()).isEqualTo(10);
        assertThat(result.get(0).getProductId()).isEqualTo(100L);

        assertThat(result.get(1).getType()).isEqualTo(WalletATM.SPEND.name());
        assertThat(result.get(1).getAmount()).isEqualTo(5);
        assertThat(result.get(1).getProductId()).isEqualTo(100L);

        verify(walletRepository).findByUserId(userId);
        verify(walletHistoryRepository).findByWalletIdOrderByCreatedAtDesc(wallet.getId());
    }

    @Test
    @DisplayName("지갑 내역 조회 실패 - 지갑 없음")
    void getWalletHistory_walletNotFound() {
        // given
        Long userId = 2L;
        when(walletRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // expect
        assertThatThrownBy(() -> walletService.getWalletHistory(userId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("지갑이 존재하지 않습니다.");
    }
}
