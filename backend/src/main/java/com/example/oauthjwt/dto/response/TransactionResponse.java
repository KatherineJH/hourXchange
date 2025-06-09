package com.example.oauthjwt.dto.response;

import java.time.LocalDateTime;

import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.Transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
    private Long id;
    private UserResponse user;
    private ProductResponse product;
    private String status;
    private LocalDateTime createdAt;
    private Long chatRoomId;
    private Long reviewId;

    public static TransactionResponse toDto(Transaction transaction) {
        return TransactionResponse.builder().id(transaction.getId()).user(UserResponse.toDto(transaction.getUser()))
                .product(ProductResponse.toDto(transaction.getProduct())).status(transaction.getStatus().toString())
                .createdAt(transaction.getCreatedAt())
                .reviewId(transaction.getReview() != null ? transaction.getReview().getId() : null).build();
    }

    public static TransactionResponse toDto(Transaction transaction, ChatRoom chatRoom) {
        return TransactionResponse.builder().id(transaction.getId()).user(UserResponse.toDto(transaction.getUser()))
                .product(ProductResponse.toDto(transaction.getProduct())).status(transaction.getStatus().toString())
                .createdAt(transaction.getCreatedAt()).chatRoomId(chatRoom.getId())
                .reviewId(transaction.getReview() != null ? transaction.getReview().getId() : null).build();
    }

    public static TransactionResponse toDto(Transaction transaction, Transaction opponent) {
        return TransactionResponse.builder().id(transaction.getId())
                .user(opponent != null ? UserResponse.toDto(opponent.getUser()) : null)
                .product(ProductResponse.toDto(transaction.getProduct())).status(transaction.getStatus().toString())
                .createdAt(transaction.getCreatedAt()).chatRoomId(transaction.getChatRoom().getId())
                .reviewId(transaction.getReview() != null ? transaction.getReview().getId() : null).build();
    }
}
