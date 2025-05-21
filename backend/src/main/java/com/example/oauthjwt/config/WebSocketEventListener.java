package com.example.oauthjwt.config;

import com.example.oauthjwt.dto.response.ChatMessageResponse;
import com.example.oauthjwt.service.ChatService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.type.ChatRoomUserStatus;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final UserRepository userRepository;
    private final ChatService chatService;

    /** 클라이언트가 WebSocket 연결을 종료(disconnect)할 때 실행 */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent sessionDisconnectEvent) {
        ChatMessageResponse result = chatService.leaveUser(sessionDisconnectEvent);

        messagingTemplate.convertAndSend("/topic/room/" + result.getChatRoom().getId(), result);
    }
}
