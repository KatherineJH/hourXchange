package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.request.ChatMessageRequest;
import com.example.oauthjwt.dto.response.ChatMessageResponse;
import com.example.oauthjwt.dto.response.ChatRoomResponse;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.transaction.annotation.Transactional;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.type.ChatRoomUserStatus;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public interface ChatService {
    @Transactional
    ChatRoomResponse initiateChatFromPost(Long postId, Long requesterId);

    @Transactional
    ChatMessageResponse saveMessage(ChatMessageRequest chatMessageRequest, String email);

    List<ChatMessage> getMessages(Long chatRoomId);

    List<ChatRoom> findChatRoomsByUserId(Long userId);

    @Transactional
    void completeTransactionByChatRoomId(Long chatRoomId);

    ChatRoom findChatRoomById(Long id);

    ChatRoom findById(Long chatRoomId);

    String getTransactionStatusByChatRoomId(Long chatRoomId);

    ChatMessageResponse addUser(ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor simpMessageHeaderAccessor);

    ChatMessageResponse leaveUser(SessionDisconnectEvent sessionDisconnectEvent);
}
