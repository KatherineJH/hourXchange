package com.example.oauthjwt.controller;

import com.example.oauthjwt.service.AiChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dialogflow")
@RequiredArgsConstructor
public class AiChatbotController {
    private final AiChatbotService aiChatbotService;

    @PostMapping("/query")
    public ResponseEntity<Map<String, String>> query(@RequestBody Map<String, String> req) {
        String message = req.get("message");
        String sessionId = req.getOrDefault("sessionId", UUID.randomUUID().toString());
        try {
            String reply = aiChatbotService.detectIntent(message, sessionId);
            Map<String, String> res = new HashMap<>();
            res.put("fulfillmentText", reply);
            res.put("sessionId", sessionId);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
