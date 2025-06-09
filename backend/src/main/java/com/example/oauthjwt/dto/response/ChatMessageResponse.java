package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.ChatMessageType;
import com.example.oauthjwt.entity.type.ChatRoomUserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Log4j2
public class ChatMessageResponse {
    private Long id;

    private ChatRoomResponse chatRoom;

    private UserResponse sender;

    private String content;

    private String chatMessageType; // 채팅 메시지 타입

    private LocalDateTime sentAt;

    public static ChatMessageResponse toDto(ChatMessage chatMessage) {
        log.info(chatMessage.toString());
        return ChatMessageResponse.builder()
                .id(chatMessage.getId())
                .chatRoom(ChatRoomResponse.toDto(chatMessage.getChatRoom()))
                .sender(UserResponse.toDto(chatMessage.getSender()))
                .content(chatMessage.getContent())
                .chatMessageType(chatMessage.getChatMessageType().toString())
                .sentAt(chatMessage.getSentAt())
                .build();

    }
}
