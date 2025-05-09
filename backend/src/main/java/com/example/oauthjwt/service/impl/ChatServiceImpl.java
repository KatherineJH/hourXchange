package com.example.oauthjwt.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.ChatService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ProductRepository productRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    @Override
    public ChatRoom initiateChatFromPost(Long postId, Long requesterId) {
        Product product = productRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 💡 상품 + 유저 조합 기준으로 중복 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByProductAndUsers(product.getId(), requesterId,
                product.getOwner().getId());

        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }

        String chatRoomName = requester.getName() + " × " + product.getOwner().getName();

        ChatRoom chatRoom = chatRoomRepository.save(ChatRoom.builder().name(chatRoomName).product(product).build());

        ChatRoomUser chatters = ChatRoomUser.builder().chatRoom(chatRoom).user1(requester).user2(product.getOwner())
                .build();

        chatRoomUserRepository.save(chatters);
        return chatRoom;
    }

    @Transactional
    @Override
    public ChatMessage saveMessage(Long chatRoomId, Long senderId, String content, ChatRoomUserStatus type) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("ChatRoom not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ChatMessage message = ChatMessage.builder().chatRoom(chatRoom).sender(sender).content(content)
                .chatRoomUserStatus(type).build();
        return chatMessageRepository.save(message);
    }

    @Override
    public List<ChatMessage> getMessages(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomId(chatRoomId);
    }

    @Override
    public Long getUserIdByUsername(String username) {
        return userRepository.findByEmail(username).map(User::getId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public List<ChatRoom> findChatRoomsByUserId(Long userId) {
        return chatRoomRepository.findChatRoomsByUserId(userId);
    }

    @Transactional
    @Override
    public void completeTransactionByChatRoomId(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방이 존재하지 않습니다."));

        Product product = chatRoom.getProduct();
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "채팅방에 연결된 상품이 없습니다.");
        }

        Transaction transaction = transactionRepository.findByProduct(product)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "거래 정보가 존재하지 않습니다."));

        transaction.setStatus(TransactionStatus.COMPLETED);
    }

    @Override
    public ChatRoom findChatRoomById(Long id) {
        return chatRoomRepository.findById(id).orElseThrow(() -> new RuntimeException("ChatRoom not found"));
    }

    @Override
    public ChatRoom findById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));
    }

    @Override
    public String getTransactionStatusByChatRoomId(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        Product product = chatRoom.getProduct();
        if (product == null) {
            throw new IllegalStateException("채팅방에 연결된 상품이 없습니다.");
        }

        return transactionRepository.findByProduct(product).map(tx -> tx.getStatus().name()).orElse("PENDING"); // 거래가
        // 없으면
        // PENDING
    }
}
