package com.example.oauthjwt.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {
    private Long id;
    private String name;
    private Long productId;
    private LocalDateTime createdAt;
}
