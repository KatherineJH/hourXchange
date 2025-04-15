package com.example.oauthjwt.service;

import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.ChatMessageRepository;
import com.example.oauthjwt.repository.ChatRoomRepository;
import com.example.oauthjwt.repository.ServiceProductRepository;
import com.example.oauthjwt.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ServiceProductRepository serviceProductRepository;

    @Transactional
    public ChatRoom createChatRoom(Long serviceProductId, Long initiatorId) {
        ServiceProduct product = serviceProductRepository.findById(serviceProductId)
                .orElseThrow(() -> new IllegalArgumentException("Service product not found"));
        User initiator = userRepository.findById(initiatorId)
                .orElseThrow(() -> new IllegalArgumentException("Initiator not found"));
        User owner = product.getOwner();

        if (initiator.equals(owner)) {
            throw new IllegalArgumentException("Cannot create chat with yourself");
        }

        // Check for existing chat room between initiator and owner for this product
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByServiceProductIdAndParticipants(
                serviceProductId, initiator.getId(), owner.getId());
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }

        // Create new chat room
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setServiceProduct(product);
        chatRoom.setCreatedAt(LocalDateTime.now());

        // Add participants
        chatRoom.addUser(owner, ChatRoomUserStatus.ACTIVE);
        chatRoom.addUser(initiator, ChatRoomUserStatus.ACTIVE);

        return chatRoomRepository.save(chatRoom);
    }

    @Transactional
    public ChatMessage saveMessage(Long chatRoomId, Long senderId, String content) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        // Verify sender is a participant
        if (!chatRoom.getParticipants().contains(sender)) {
            throw new SecurityException("User is not a participant in this chat room");
        }

        ChatMessage message = new ChatMessage();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(content);
        message.setSentAt(LocalDateTime.now());

        return chatMessageRepository.save(message);
    }

    public boolean hasAccess(Long chatRoomId, Long userId) {
        return chatRoomRepository.findById(chatRoomId)
                .map(room -> room.getParticipants().stream()
                        .anyMatch(user -> user.getId().equals(userId)))
                .orElse(false);
    }

    public Optional<ChatRoom> getChatRoom(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId);
    }
}
