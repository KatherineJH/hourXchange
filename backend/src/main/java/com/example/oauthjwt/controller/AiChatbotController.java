package com.example.oauthjwt.controller;

import com.example.oauthjwt.service.impl.AiChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dialogflow")
@RequiredArgsConstructor
public class AiChatbotController {
    private final AiChatbotService aiChatbotService;

    // ai 챗봇
    @PostMapping("/query")
    public ResponseEntity<Map<String, String>> query(@RequestBody Map<String, String> req) {
        // 메세지와 세션 아이디 조회 및 생성
        String message = req.get("message");
        String sessionId = req.getOrDefault("sessionId", UUID.randomUUID().toString());

        // 서비스 호출 및 응답 생성
        String reply = aiChatbotService.detectIntent(message, sessionId);
        Map<String, String> res = new HashMap<>();
        res.put("fulfillmentText", reply);
        res.put("sessionId", sessionId);
        return ResponseEntity.ok(res);
    }
}
