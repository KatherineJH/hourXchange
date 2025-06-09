package com.example.oauthjwt.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.response.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.ChatMessageRequest;
import com.example.oauthjwt.dto.response.ChatRoomResponse;
import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.service.ChatService;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.example.oauthjwt.service.TransactionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final TransactionService transactionService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
        String email = (String) simpMessageHeaderAccessor.getSessionAttributes().get("userId");

        ChatMessageResponse result = chatService.saveMessage(chatMessageRequest, email);

        messagingTemplate.convertAndSend("/topic/room/" + result.getChatRoom().getId(), result);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {

        ChatMessageResponse result = chatService.addUser(chatMessageRequest, simpMessageHeaderAccessor);

        messagingTemplate.convertAndSend("/topic/room/" + result.getChatRoom().getId(), result);

        log.info("{} 입장 메시지 브로드캐스트 완료", result.getSender().getName());
    }

    @PostMapping("/initiate/{productId}")
    public ResponseEntity<?> initiateChat(@PathVariable Long productId, @RequestParam Long requesterId) {
        ChatRoomResponse result = chatService.initiateChatFromPost(productId, requesterId);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/messages/{chatRoomId}")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable Long chatRoomId) {
        List<ChatMessage> messages = chatService.getMessages(chatRoomId);
        List<ChatMessageResponse> messageDTOs = messages.stream().map(ChatMessageResponse::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(messageDTOs);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getUserChatRooms(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ChatRoomResponse> result = chatService.findChatRoomsByUserId(userDetails);

        return ResponseEntity.ok(result);
    }

    @PatchMapping("/match/{chatRoomId}")
    public ResponseEntity<?> completeTransaction(@PathVariable Long chatRoomId) {
        chatService.completeTransactionByChatRoomId(chatRoomId);
        return ResponseEntity.ok("거래가 완료되었습니다.");
    }

    @GetMapping("/room-info/{chatRoomId}")
    public ResponseEntity<ChatRoomInfoResponse> getChatRoomInfo(@PathVariable Long chatRoomId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ChatRoom chatRoom = chatService.findById(chatRoomId);

        String transactionStatus = chatService.getTransactionStatusByChatRoomId(chatRoomId);

        ChatRoomInfoResponse response = ChatRoomInfoResponse.builder()
                .chatRoomId(chatRoom.getId())
                .ownerId(chatRoom.getProduct().getOwner().getId())
                .transactionStatus(transactionStatus)
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/request/{chatRoomId}")
    public ResponseEntity<?> requestTransaction(@PathVariable Long chatRoomId,
                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        ChatRoom chatRoom = chatService.findById(chatRoomId);
        Long requesterId = userDetails.getUser().getId();
        if (chatRoom.getProduct().getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "상품 소유자는 요청할 수 없습니다.");
        }
        transactionService.updateTransactionStatusToRequested(chatRoomId, requesterId);
        return ResponseEntity.ok("요청이 완료되었습니다.");
    }

    @PatchMapping("/accept/{chatRoomId}")
    public ResponseEntity<?> acceptTransaction(@PathVariable Long chatRoomId,
                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        ChatRoom chatRoom = chatService.findById(chatRoomId);
        Long ownerId = userDetails.getUser().getId();
        if (!chatRoom.getProduct().getOwner().getId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "상품 소유자만 수락할 수 있습니다.");
        }
        transactionService.updateTransactionStatusToAccepted(chatRoomId);
        return ResponseEntity.ok("거래가 수락되었습니다.");
    }
}
