package com.example.oauthjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
  List<ChatMessage> findByChatRoomId(Long chatRoomId);
}
