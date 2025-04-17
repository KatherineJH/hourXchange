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
        StompHeaderAccessor headerAccessor =
                StompHeaderAccessor.wrap(event.getMessage()); // 이벤트 메시지에서 STOMP 관련 헤더 정보 추출
        // ✅ userId(WebSocket 연결 시 저장했던 세션 정보에서 사용자 아이디) <- WebSocket 연결 시에 사용한 변수와 일치해야 함
        String username =
                (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
        User user =
                userRepository
                        .findByUsername(username) // DB에서 사용자 정보 조회 -> 없으면 예외 발생
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        if (username != null) {
            log.info("user disconnected: {}", username);
            ChatMessage chatMessage =
                    ChatMessage.builder()
                            .chatRoomUserStatus(ChatRoomUserStatus.LEAVE)
                            .content(username + "님이 퇴장하셨습니다.") // ✅ content 넣기
                            .build();
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
