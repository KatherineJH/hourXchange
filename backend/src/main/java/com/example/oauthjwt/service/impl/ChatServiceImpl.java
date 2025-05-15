package com.example.oauthjwt.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.oauthjwt.dto.request.ChatMessageRequest;
import com.example.oauthjwt.dto.response.ChatMessageResponse;
import com.example.oauthjwt.dto.response.ChatRoomResponse;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.type.ChatMessageType;
import com.example.oauthjwt.entity.type.ChatRoomUserStatus;
import com.example.oauthjwt.entity.type.TransactionStatus;
import com.example.oauthjwt.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.ChatService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ProductRepository productRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public Optional<ChatRoom> findByProductAndUsers(Long productId, Long user1Id, Long user2Id) {
        return chatRoomRepository.findByProductAndUsers(productId, user1Id, user2Id);
    }

    @Transactional
    @Override
    public ChatRoomResponse initiateChatFromPost(Long productId, Long requesterId) {

        // 상품 정보 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "상품 정보가 존재하지 않습니다."));

        if (product.getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "자신의 상품에 대해 채팅방을 생성할 수 없습니다.");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유저 정보가 존재하지 않습니다."));


        // 1) 기존 방 조회
        Optional<ChatRoom> existing = chatRoomRepository.findByProductAndParticipants(
                product.getId(), product.getOwner().getId(), requesterId
        );

        if (existing.isPresent()) {
            return ChatRoomResponse.toDto(existing.get());
        }

        ChatRoom room = ChatRoom.of(product, requester);

        ChatRoomUser chatRoomProductOwner = ChatRoomUser.of(product.getOwner(), room);
        ChatRoomUser chatRoomRequester = ChatRoomUser.of(requester, room);

        room.getChatRoomUsers().add(chatRoomProductOwner);
        room.getChatRoomUsers().add(chatRoomRequester);

        ChatRoom result = chatRoomRepository.save(room);

        return ChatRoomResponse.toDto(result);
    }

    @Transactional
    @Override
    public ChatMessageResponse saveMessage(ChatMessageRequest chatMessageRequest, String email) {

        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageRequest.getChatRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "채팅방 정보가 존재하지 않습니다."));
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유저 정보가 존재하지 않습니다."));

        ChatMessage result = ChatMessage.of(chatRoom, sender, chatMessageRequest.getContent(), chatMessageRequest.getType());

        return ChatMessageResponse.toDto(chatMessageRepository.save(result));
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

        // 나(현재 로그인 사용자)가 누구인지 찾기 위해 채팅방 참여자 확인
        List<User> participants = chatRoom.getParticipants();
        if (participants.size() != 2) {
            throw new IllegalStateException("채팅방 참여자가 2명이 아닙니다.");
        }
        // 게시자는 product.getOwner(), 컨택한 자는 그 외 한 명
        User buyer = participants.stream()
                .filter(p -> !p.getId().equals(product.getOwner().getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("구매자 정보를 찾을 수 없습니다."));

        return transactionRepository.findByProductAndUser(product, buyer)
                .map(tx -> tx.getStatus().name())
                .orElse("PENDING");
    }

    @Override
    public ChatRoom findByProductId(Long productId) {
        return chatRoomRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."));
    }

    @Override
    @Transactional
    public ChatMessageResponse addUser(ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {

        Map<String, Object> sessionAttributes = simpMessageHeaderAccessor.getSessionAttributes();
        if (sessionAttributes == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "웹 소켓 세션이 존재하지 않습니다.");
        }

        String email = (String) sessionAttributes.get("userId");
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "세션에 저장된 유저의 아이디 값이 존재하지 않습니다.");
        }

        Long chatRoomId = chatMessageRequest.getChatRoomId();
        if (chatRoomId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "채팅방 아이디 값이 존재하지 않습니다.");
        }

        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageRequest.getChatRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "채팅방 정보가 존재하지 않습니다."));

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유저 정보가 존재하지 않습니다."));

        ChatMessage result = ChatMessage.of(chatRoom, sender, sender.getName() + "님이 입장하셨습니다.", ChatMessageType.TEXT);

        // 세션에 저장
        sessionAttributes.put("chatRoomId", chatRoomId);

        return ChatMessageResponse.toDto(result);

    }

    @Override
    @Transactional
    public ChatMessageResponse leaveUser(SessionDisconnectEvent sessionDisconnectEvent) {

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(sessionDisconnectEvent.getMessage());

        String email = (String) headerAccessor.getSessionAttributes().get("userId");
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "세션에 저장된 유저의 아이디 값이 존재하지 않습니다.");
        }

        Long chatRoomId = (Long) headerAccessor.getSessionAttributes().get("chatRoomId");
        if (chatRoomId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "채팅방 아이디 값이 존재하지 않습니다.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유저 정보가 존재하지 않습니다."));

        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "채팅방 정보가 존재하지 않습니다."));

        ChatRoomUser chatRoomUser = chatRoomUserRepository.findByChatRoomAndUser(chatRoom, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "채팅방 유저 정보가 존재하지 않습니다."));

        chatRoomUser.setChatRoomUserStatus(ChatRoomUserStatus.LEAVE);

        chatRoomUserRepository.save(chatRoomUser);

        ChatMessage result = ChatMessage.of(chatRoom, user, user.getName() + "님이 퇴장하셨습니다.", ChatMessageType.TEXT);

        return ChatMessageResponse.toDto(result);
    }
}
