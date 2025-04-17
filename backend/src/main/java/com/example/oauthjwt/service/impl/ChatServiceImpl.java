package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ServiceProductRepository serviceProductRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;

    @Transactional
    @Override
    public ChatRoom initiateChatFromPost(Long postId, Long requesterId) {
        ServiceProduct serviceProduct =
                serviceProductRepository
                        .findById(postId)
                        .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User requester =
                userRepository
                        .findById(requesterId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 이미 채팅방이 있는지 확인
        Optional<ChatRoomUser> existingChatters =
                chatRoomUserRepository.findByUser1IdAndUser2Id(requesterId, serviceProduct.getOwner().getId());
        if (existingChatters.isPresent()) {
            return existingChatters.get().getChatRoom();
        }

        // 새로운 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder().build();
        chatRoom = chatRoomRepository.save(chatRoom);

        // Chatters 생성
        ChatRoomUser chatters =
                ChatRoomUser.builder().user1(requester).user2(serviceProduct.getOwner()).chatRoom(chatRoom).build();
        chatRoomUserRepository.save(chatters);

        return chatRoom;
    }

    @Transactional
    @Override
    public ChatMessage saveMessage(Long chatRoomId, Long senderId, String content, ChatRoomUserStatus type) {
        ChatRoom chatRoom =
                chatRoomRepository
                        .findById(chatRoomId)
                        .orElseThrow(() -> new IllegalArgumentException("ChatRoom not found"));
        User sender =
                userRepository
                        .findById(senderId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ChatMessage message =
                ChatMessage.builder()
                        .chatRoom(chatRoom)
                        .sender(sender)
                        .content(content)
                        .chatRoomUserStatus(type)
                        .build();
        return chatMessageRepository.save(message);
    }

    @Override
    public List<ChatMessage> getMessages(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomId(chatRoomId);
    }

    @Override
    public Long getUserIdByUsername(String username) {
        return userRepository
                .findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
