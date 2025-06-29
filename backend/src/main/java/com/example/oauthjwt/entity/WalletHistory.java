package com.example.oauthjwt.entity;

import java.time.LocalDateTime;

import com.example.oauthjwt.entity.type.WalletATM;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WalletATM type; // EARN, SPEND, ADJUST, etc.

    @Column(nullable = false)
    private int amount; // 출금 or 입금 금액

    @Column(nullable = false)
    private int balance; // 변동 전 잔액

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public static WalletHistory of(User opponent, Product product, WalletATM walletATM, int hours) {
        return WalletHistory.builder().wallet(opponent.getWallet()).product(product).type(walletATM).amount(hours)
                .balance(opponent.getWallet().getCredit()).createdAt(LocalDateTime.now()).build();
    }
}
