package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.AiChatRequest;
import com.example.oauthjwt.dto.response.AiChatResponse;
import com.example.oauthjwt.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AiChatController {
    private final AiChatService aiService;

    @PostMapping
    public Mono<AiChatResponse> chat(@RequestBody AiChatRequest req) {
        return aiService.chat(req.getHistory(), req.getMessage());
    }
}
