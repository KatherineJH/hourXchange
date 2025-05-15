package com.example.oauthjwt.dto.request;

import com.example.oauthjwt.entity.type.ChatMessageType;
import com.example.oauthjwt.entity.type.ChatRoomUserStatus;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequest {

    private Long chatRoomId;
    private String senderUsername;
    private String content;
    private ChatMessageType type;
    private String sentAt;
}
