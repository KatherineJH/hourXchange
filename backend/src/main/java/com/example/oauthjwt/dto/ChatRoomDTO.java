package com.example.oauthjwt.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {
    private Long id;
    private String name;
    private Long serviceProductId;
    private LocalDateTime createdAt;
}
