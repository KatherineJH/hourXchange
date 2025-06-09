package com.example.oauthjwt.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.oauthjwt.dto.response.ChatMessageResponse;
import com.example.oauthjwt.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatService chatService;

    /** 클라이언트가 WebSocket 연결을 종료(disconnect)할 때 실행 */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent sessionDisconnectEvent) {
        ChatMessageResponse result = chatService.leaveUser(sessionDisconnectEvent);

        messagingTemplate.convertAndSend("/topic/room/" + result.getChatRoom().getId(), result);
    }
}
