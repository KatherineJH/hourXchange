package com.example.oauthjwt.config;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Value("${url.frontend}")
    String urlFrontend;

    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins(urlFrontend) // 프론트엔드 URL로 제한 권장
                .addInterceptors(jwtHandshakeInterceptor); // DI 주입된 Bean 사용
        log.info("WebSocket EndPoint Enrolled");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        /**
         * 라이언트가 전송하는 메시지의 목적지 prefix 클라이언트에서 /app/chat.sendMessage로 보내면
         * -> @MessageMapping("/chat.sendMessage")로 라우팅
         */
        registry.setApplicationDestinationPrefixes("/app");
        /**
         * 메시지를 구독하는 클라이언트에게 메시지를 전달할 때 사용하는 prefix 서버가 /topic/room/1 에 메시지를 publish ->
         * 클라이언트는 stomp.subscribe("/topic/room/1") 으로 수신
         */
        registry.enableSimpleBroker("/topic");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new org.springframework.messaging.support.ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
                    if (sessionAttributes != null) {
                        Object userId = sessionAttributes.get("userId");
                        if (userId != null) {
                            accessor.setUser(() -> userId.toString());
                            log.info("WebSocket 세션 사용자 설정: {}", userId);
                        }
                    }
                }

                return message;
            }
        });
    }
}
