package com.example.oauthjwt.service;

import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.dto.request.ChatMessageRequest;
import com.example.oauthjwt.dto.response.ChatMessageResponse;
import com.example.oauthjwt.dto.response.ChatRoomResponse;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.transaction.annotation.Transactional;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public interface ChatService {
    Optional<ChatRoom> findByProductAndUsers(Long productId, Long user1Id, Long user2Id);

    @Transactional
    ChatRoomResponse initiateChatFromPost(Long postId, Long requesterId);

    @Transactional
    ChatMessageResponse saveMessage(ChatMessageRequest chatMessageRequest, String email);

    List<ChatMessage> getMessages(Long chatRoomId);

    List<ChatRoomResponse> findChatRoomsByUserId(CustomUserDetails userDetails);

    @Transactional
    void completeTransactionByChatRoomId(Long chatRoomId);

    ChatRoom findById(Long chatRoomId);

    String getTransactionStatusByChatRoomId(Long chatRoomId);

    ChatMessageResponse addUser(ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor simpMessageHeaderAccessor);

    ChatMessageResponse leaveUser(SessionDisconnectEvent sessionDisconnectEvent);
}
