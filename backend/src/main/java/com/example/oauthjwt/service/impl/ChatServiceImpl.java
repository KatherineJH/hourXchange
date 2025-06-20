package com.example.oauthjwt.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.oauthjwt.dto.request.ChatMessageRequest;
import com.example.oauthjwt.dto.response.ChatMessageResponse;
import com.example.oauthjwt.dto.response.ChatRoomResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.ChatMessageType;
import com.example.oauthjwt.entity.type.ChatRoomUserStatus;
import com.example.oauthjwt.entity.type.TransactionStatus;
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

    @Override
    public Optional<ChatRoom> findByProductAndUsers(Long productId, Long user1Id, Long user2Id) {
        return chatRoomRepository.findByProductAndParticipants(productId, user1Id, user2Id);
    }

    @Transactional
    @Override
    public ChatRoomResponse initiateChatFromPost(Long productId, Long requesterId) {

        // 상품 정보 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상품 정보가 존재하지 않습니다."));

        if (product.getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "자신의 상품에 대해 채팅방을 생성할 수 없습니다.");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        // 1) 기존 방 조회
        Optional<ChatRoom> existing = chatRoomRepository.findByProductAndParticipants(product.getId(),
                product.getOwner().getId(), requesterId);

        if (existing.isPresent()) {
            return ChatRoomResponse.toDto(existing.get());
        }

        ChatRoom room = ChatRoom.of(product);

        ChatRoomUser chatRoomProductOwner = ChatRoomUser.of(product.getOwner(), room);
        ChatRoomUser chatRoomRequester = ChatRoomUser.of(requester, room);

        room.getChatRoomUsers().add(chatRoomProductOwner);
        room.getChatRoomUsers().add(chatRoomRequester);

        ChatRoom savedRoom = chatRoomRepository.save(room); // chatRoomUser도 같이 저장됨

        return ChatRoomResponse.toDto(savedRoom);
    }

    @Transactional
    @Override
    public ChatMessageResponse saveMessage(ChatMessageRequest chatMessageRequest, String email) {

        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageRequest.getChatRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방 정보가 존재하지 않습니다."));
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        ChatMessage result = ChatMessage.of(chatRoom, sender, chatMessageRequest.getContent(),
                chatMessageRequest.getType());

        return ChatMessageResponse.toDto(chatMessageRepository.save(result));
    }

    @Override
    public List<ChatMessage> getMessages(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomId(chatRoomId);
    }

    @Override
    public List<ChatRoomResponse> findChatRoomsByUserId(CustomUserDetails userDetails) {
        List<ChatRoom> chatRoomList = chatRoomRepository.findChatRoomsByUserId(userDetails.getUser().getId());
        return chatRoomList.stream().map(ChatRoomResponse::toDto).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void completeTransactionByChatRoomId(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방이 존재하지 않습니다."));

        Product product = chatRoom.getProduct();
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방에 연결된 상품이 없습니다.");
        }

        Transaction transaction = transactionRepository.findByProduct(product)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "거래 정보가 존재하지 않습니다."));

        transaction.setStatus(TransactionStatus.COMPLETED);
    }

    @Override
    public ChatRoom findById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."));
    }

    @Override
    public String getTransactionStatusByChatRoomId(Long chatRoomId) {
        List<Transaction> txList = transactionRepository.findByChatRoomId(chatRoomId);

        if (txList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 채팅방에 연결된 거래가 존재하지 않습니다.");
        }

        // 가장 최신 거래 기준으로 처리
        Transaction latest = txList.stream().max((t1, t2) -> t1.getCreatedAt().compareTo(t2.getCreatedAt()))
                .orElseThrow(); // theoretically never null

        return latest.getStatus().name();
    }

    @Override
    @Transactional
    public ChatMessageResponse addUser(ChatMessageRequest chatMessageRequest,
            SimpMessageHeaderAccessor simpMessageHeaderAccessor) {

        Map<String, Object> sessionAttributes = simpMessageHeaderAccessor.getSessionAttributes();
        if (sessionAttributes == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "웹 소켓 세션이 존재하지 않습니다.");
        }

        String email = (String) sessionAttributes.get("userId");
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "세션에 저장된 유저의 아이디 값이 존재하지 않습니다.");
        }

        Long chatRoomId = chatMessageRequest.getChatRoomId();
        if (chatRoomId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방 아이디 값이 존재하지 않습니다.");
        }

        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageRequest.getChatRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방 정보가 존재하지 않습니다."));

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "세션에 저장된 유저의 아이디 값이 존재하지 않습니다.");
        }

        Long chatRoomId = (Long) headerAccessor.getSessionAttributes().get("chatRoomId");
        if (chatRoomId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방 아이디 값이 존재하지 않습니다.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방 정보가 존재하지 않습니다."));

        ChatRoomUser chatRoomUser = chatRoomUserRepository.findByChatRoomAndUser(chatRoom, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방 유저 정보가 존재하지 않습니다."));

        chatRoomUser.setChatRoomUserStatus(ChatRoomUserStatus.LEAVE);

        chatRoomUserRepository.save(chatRoomUser);

        ChatMessage result = ChatMessage.of(chatRoom, user, user.getName() + "님이 퇴장하셨습니다.", ChatMessageType.TEXT);

        return ChatMessageResponse.toDto(result);
    }
}
