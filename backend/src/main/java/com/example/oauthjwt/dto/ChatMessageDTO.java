package com.example.oauthjwt.dto;

import com.example.oauthjwt.entity.ChatRoomUserStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
  private Long id;
  private Long chatRoomId;
  private String senderUsername;
  private String content;
  private ChatRoomUserStatus type;
  private String sentAt;
}
