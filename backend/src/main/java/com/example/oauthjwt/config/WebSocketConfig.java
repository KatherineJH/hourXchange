package com.example.oauthjwt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket을 사용하기 위한 설정 클래스
 * STOMP 프로토콜을 사용하여 WebSocket 메시지를 처리
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * 메시지 브로커 설정 메서드
     * 클라이언트가 구독하거나 서버가 전송하는 목적지(prefix)를 설정
     * 예: /queue/room1 → 특정 유저나 방으로 메시지를 보낼 때 사용
     * /app/chat/send → 클라이언트가 메시지를 보낼 때 컨트롤러의 @MessageMapping("/chat/send")으로 라우팅
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") // 향후에 ("http://localhost:5173") 으로 고칠 것.
                .withSockJS();
    }
}
