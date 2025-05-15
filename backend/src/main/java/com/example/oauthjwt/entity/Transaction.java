package com.example.oauthjwt.entity;

import java.time.LocalDateTime;

import com.example.oauthjwt.dto.request.TransactionRequest;

import com.example.oauthjwt.entity.type.TransactionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @OneToOne(mappedBy = "transaction", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Review review;

    public static Transaction of(TransactionRequest transactionRequest, User user, Product product,
            TransactionStatus status, ChatRoom chatRoom) {
        return Transaction.builder().user(user).product(product).status(status).chatRoom(chatRoom).createdAt(LocalDateTime.now()).build();
    }

    public Transaction setUpdateValue(TransactionRequest transactionRequest, User user, Product product,
            TransactionStatus status) {
        this.user = user;
        this.product = product;
        this.status = status;
        this.createdAt = transactionRequest.getCreateAt();
        return this;
    }
}
