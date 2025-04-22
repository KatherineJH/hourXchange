package com.example.oauthjwt.config;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoomUserStatus;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;


@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final UserRepository userRepository;

    /** ✅ 클라이언트가 WebSocket 연결을 종료(disconnect)할 때 실행 */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("userId");
        if (username == null) {
            log.warn("No userId found in session");
            return;
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        String chatRoomId = (String) headerAccessor.getSessionAttributes().get("chatRoomId");
        if (chatRoomId == null) {
            log.warn("No chatRoomId found for user: {}", username);
            return;
        }

        log.info("User disconnected: {}", username);
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoomUserStatus(ChatRoomUserStatus.LEAVE)
                .content(username + "님이 퇴장하셨습니다.")
                .build();
        messagingTemplate.convertAndSend("/topic/room/" + chatRoomId, chatMessage);
    }
}
