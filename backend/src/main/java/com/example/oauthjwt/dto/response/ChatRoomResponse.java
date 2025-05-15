package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.ChatRoomUser;
import com.example.oauthjwt.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomResponse {

    private Long id;

    private String name;

    private ProductResponse product;

    private LocalDateTime createdAt;

    public static ChatRoomResponse toDto(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .name(chatRoom.getName())
                .product(ProductResponse.toDto(chatRoom.getProduct()))
                .createdAt(chatRoom.getCreatedAt())
                .build();
    }
}
