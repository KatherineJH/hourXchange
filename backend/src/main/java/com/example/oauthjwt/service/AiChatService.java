package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.AiChatMessage;
import com.example.oauthjwt.dto.response.AiChatResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AiChatService {
    @Value("${openai.api-key}") private String apiKey;
    @Value("${openai.endpoint}") private String endpoint;

    private final WebClient webClient;

    public AiChatService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public Mono<AiChatResponse> chat(List<AiChatMessage> history, String message) {
        var messages = new ArrayList<Map<String,String>>();
        if (history != null) {
            history.forEach(cm -> messages.add(Map.of("role", cm.getRole(), "content", cm.getContent())));
        }
        messages.add(Map.of("role", "user", "content", message));

        var body = Map.of("model", "gpt-3.5-turbo", "messages", messages);

        return webClient.post()
                .uri(endpoint)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    String reply = json.at("/choices/0/message/content").asText().trim();
                    AiChatResponse res = new AiChatResponse();
                    res.setReply(reply);
                    return res;
                });
    }
}
