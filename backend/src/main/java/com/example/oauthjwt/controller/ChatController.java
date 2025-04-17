package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.ChatMessageDTO;
import com.example.oauthjwt.dto.ChatRoomDTO;
import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.ChatRoomUserStatus;
import com.example.oauthjwt.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
        System.out.println("📩 Received Message: " + messageDTO.getContent() + " from " + username);
        ChatMessage savedMessage =
                chatService.saveMessage(
                        messageDTO.getChatRoomId(),
                        chatService.getUserIdByUsername(username),
                        messageDTO.getContent(),
                        messageDTO.getType());

        messageDTO.setSenderUsername(username);
        messagingTemplate.convertAndSend("/topic/room/" + messageDTO.getChatRoomId(), messageDTO);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(
            @Payload ChatMessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) headerAccessor.getSessionAttributes().get("userId");
        headerAccessor.getSessionAttributes().put("userId", username);
        messageDTO.setSenderUsername(username);
        messageDTO.setType(ChatRoomUserStatus.JOIN); // ✅ 입장 메시지 타입 지정
        messageDTO.setContent(username + "님이 입장하셨습니다.");
        messagingTemplate.convertAndSend("/topic/room/" + messageDTO.getChatRoomId(), messageDTO);
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
}
