package com.example.oauthjwt.service;

import com.example.oauthjwt.entity.ChatMessage;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.ChatRoomUserStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public interface ChatService {
    @Transactional
    public abstract ChatRoom initiateChatFromPost(Long postId, Long requesterId);

    @Transactional
    public abstract ChatMessage saveMessage(Long chatRoomId, Long senderId, String content, ChatRoomUserStatus type);

    List<ChatMessage> getMessages(Long chatRoomId);

    Long getUserIdByUsername(String username);
}
