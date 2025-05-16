package com.example.oauthjwt.dto.request;

import com.example.oauthjwt.dto.AiChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatRequest {
    private String message;
    private List<AiChatMessage> history;
}
