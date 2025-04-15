package com.example.oauthjwt.controller.chat;

import com.example.oauthjwt.dto.CustomOAuth2User;
import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{chatRoomId}/send")
    public void sendMessage(
            @DestinationVariable Long chatRoomId,
            @Payload String content,
            Authentication authentication
    ) {
        /**
         * 원래 코드
         * */
//        User user = (User) authentication.getPrincipal();
//        if (!chatService.hasAccess(chatRoomId, user.getId())) {
//            throw new SecurityException("Access denied to chat room");
//        }
//        ChatMessage message = chatService.saveMessage(chatRoomId, user.getId(), content);

        /**
         * 채팅용 테스트
         */
        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
        Long userId = customUser.getUserDTO().getId();
        if (!chatService.hasAccess(chatRoomId, userId)) {
            throw new SecurityException("Access denied to chat room");
        }
        ChatMessage message = chatService.saveMessage(chatRoomId, userId, content);

        // Send to both participants
        chatService.getChatRoom(chatRoomId)
                .map(ChatRoom::getParticipants)
                .ifPresent(participants ->
                        participants.forEach(participant ->
                                messagingTemplate.convertAndSendToUser(
                                        participant.getUsername(),
                                        "/queue/messages/" + chatRoomId,
                                        message
                                )
                        )
                );
    }

    @MessageMapping("/chat/create/{serviceProductId}")
    public void createChatRoom(
            @DestinationVariable Long serviceProductId,
            Authentication authentication
    ) {
        /**
         * 원래 코드
         * */
//        User user = (User) authentication.getPrincipal();
//        ChatRoom chatRoom = chatService.createChatRoom(serviceProductId, user.getId());

        /**
         * 채팅용 테스트
         */
        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
        Long userId = customUser.getUserDTO().getId();
        ChatRoom chatRoom = chatService.createChatRoom(serviceProductId, userId);

        // Notify both participants
        chatRoom.getParticipants().forEach(participant ->
                messagingTemplate.convertAndSendToUser(
                        participant.getUsername(),
                        "/queue/chatrooms",
                        chatRoom
                )
        );
    }
}
