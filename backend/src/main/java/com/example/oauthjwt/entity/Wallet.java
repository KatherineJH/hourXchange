package com.example.oauthjwt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int credit;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public void addCredit(int amount) {
        this.credit += amount;
    }

    public void subtractCredit(int amount) {
        if (this.credit < amount) {
            throw new IllegalArgumentException("보유한 크레딧이 부족합니다.");
        }
        this.credit -= amount;
    }
}
