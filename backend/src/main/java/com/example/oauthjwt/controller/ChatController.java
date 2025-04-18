package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.ChatMessageDTO;
import com.example.oauthjwt.dto.ChatRoomDTO;
import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.ChatRoomUserStatus;
import com.example.oauthjwt.service.ChatService;
import com.example.oauthjwt.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(
            @Payload ChatMessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) headerAccessor.getSessionAttributes().get("userId");
        log.info("📩 Received Message: {} from {}", messageDTO.getContent(), username);
        ChatMessage savedMessage = chatService.saveMessage(
                messageDTO.getChatRoomId(),
                chatService.getUserIdByUsername(username),
                messageDTO.getContent(),
                messageDTO.getType());

        messageDTO.setSenderUsername(username);
        messagingTemplate.convertAndSend("/topic/room/" + messageDTO.getChatRoomId(), messageDTO);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(
            @Payload ChatMessageDTO messageDTO,
            SimpMessageHeaderAccessor headerAccessor) {

        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes == null) {
            log.error("❌ WebSocket 세션 속성이 null입니다.");
            return;
        }

        String username = (String) sessionAttributes.get("userId");
        if (username == null) {
            log.error("❌ WebSocket 세션에 userId 없음.");
            return;
        }

        Long chatRoomId = messageDTO.getChatRoomId();
        if (chatRoomId == null) {
            log.error("❌ 클라이언트에서 chatRoomId 누락됨.");
            return;
        }

        // 세션에 저장
        sessionAttributes.put("chatRoomId", chatRoomId);

        messageDTO.setSenderUsername(username);
        messageDTO.setType(ChatRoomUserStatus.JOIN);
        messageDTO.setContent(username + "님이 입장하셨습니다.");

        messagingTemplate.convertAndSend("/topic/room/" + chatRoomId, messageDTO);
        log.info("🚪 {} 입장 메시지 브로드캐스트 완료", username);
    }


    @PostMapping("/initiate/{postId}")
    public ResponseEntity<ChatRoomDTO> initiateChat(
            @PathVariable Long postId, @RequestParam Long requesterId) {
        ChatRoom chatRoom = chatService.initiateChatFromPost(postId, requesterId);
        ChatRoomDTO chatRoomDTO =
                ChatRoomDTO.builder().id(chatRoom.getId()).name(chatRoom.getName()).build();
        return ResponseEntity.ok(chatRoomDTO);
    }

    @GetMapping("/messages/{chatRoomId}")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable Long chatRoomId) {
        List<ChatMessage> messages = chatService.getMessages(chatRoomId);
        List<ChatMessageDTO> messageDTOs =
                messages.stream()
                        .map(
                                msg ->
                                        ChatMessageDTO.builder()
                                                .id(msg.getId())
                                                .chatRoomId(msg.getChatRoom().getId())
                                                .senderUsername(msg.getSender().getUsername())
                                                .content(msg.getContent())
                                                .type(msg.getChatRoomUserStatus())
                                                .sentAt(msg.getSentAt().toString())
                                                .build())
                        .collect(Collectors.toList());
        return ResponseEntity.ok(messageDTOs);
    }

//    @GetMapping("/rooms")
//    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms(@RequestParam Long userId) {
//        List<ChatRoom> chatRooms = chatService.findChatRoomsByUserId(userId);
//        List<ChatRoomDTO> result = chatRooms.stream()
//                .map(room -> ChatRoomDTO.builder()
//                        .id(room.getId())
//                        .name(room.getName())
//                        .serviceProductId(room.getServiceProduct().getId())
//                        .createdAt(room.getCreatedAt())
//                        .build())
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(result);
//    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();

        List<ChatRoom> chatRooms = chatService.findChatRoomsByUserId(userId);
        List<ChatRoomDTO> result = chatRooms.stream()
                .map(room -> ChatRoomDTO.builder()
                        .id(room.getId())
                        .name(room.getName())
                        .serviceProductId(room.getServiceProduct().getId())
                        .createdAt(room.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
