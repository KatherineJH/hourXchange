package com.example.oauthjwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatMessage {
    private String role;    // "user" 또는 "assistant"
    private String content;
}
