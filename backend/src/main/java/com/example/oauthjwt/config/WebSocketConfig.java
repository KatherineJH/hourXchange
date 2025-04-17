package com.example.oauthjwt.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") // 프론트엔드 URL로 제한 권장
                .addInterceptors(jwtHandshakeInterceptor); // ✅ DI 주입된 Bean 사용
        System.out.println("🧩 WebSocket EndPoint Enrolled");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        /**
         * 라이언트가 전송하는 메시지의 목적지 prefix 클라이언트에서 /app/chat.sendMessage로 보내면
         * -> @MessageMapping("/chat.sendMessage")로 라우팅
         */
        registry.setApplicationDestinationPrefixes("/app");
        /**
         * 메시지를 구독하는 클라이언트에게 메시지를 전달할 때 사용하는 prefix 서버가 /topic/room/1 에 메시지를 publish -> 클라이언트는
         * stomp.subscribe("/topic/room/1") 으로 수신
         */
        registry.enableSimpleBroker("/topic");
    }

}
