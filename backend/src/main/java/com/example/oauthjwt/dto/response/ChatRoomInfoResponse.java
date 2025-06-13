package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.ChatRoom;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChatRoomInfoResponse {
    private Long chatRoomId;
    private Long ownerId;
    private String transactionStatus;
    private ProductResponse product;

    public static ChatRoomInfoResponse toDto(ChatRoom chatRoom, String transactionStatus) {
        return ChatRoomInfoResponse.builder()
                .chatRoomId(chatRoom.getId())
                .ownerId(chatRoom.getProduct().getOwner().getId())
                .transactionStatus(transactionStatus)
                .product(ProductResponse.toDto(chatRoom.getProduct()))
                .build();
    }
}
