package com.example.oauthjwt.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.ChatRoomUserStatus;

public interface ChatService {
  @Transactional
  public abstract ChatRoom initiateChatFromPost(Long postId, Long requesterId);

  @Transactional
  public abstract ChatMessage saveMessage(Long chatRoomId, Long senderId, String content, ChatRoomUserStatus type);

  List<ChatMessage> getMessages(Long chatRoomId);

  Long getUserIdByUsername(String username);

  List<ChatRoom> findChatRoomsByUserId(Long userId);

  @Transactional
  void completeTransactionByChatRoomId(Long chatRoomId);

  ChatRoom findChatRoomById(Long id);

  ChatRoom findById(Long chatRoomId);

  String getTransactionStatusByChatRoomId(Long chatRoomId);
}
