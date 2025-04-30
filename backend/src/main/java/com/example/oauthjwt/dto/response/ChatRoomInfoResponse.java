package com.example.oauthjwt.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChatRoomInfoResponse {
  private Long chatRoomId;
  private Long ownerId;
  private String transactionStatus;
}
