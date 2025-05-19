package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.ChatMessageRequest;
import com.example.oauthjwt.dto.response.ChatMessageResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.ChatMessageType;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.impl.ChatServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * ChatServiceTest는 ChatServiceImpl 클래스의 채팅 기능에 대한 단위 테스트를 제공.
 * 채팅방 생성, 메시지 저장, 예외 처리 등 사용자 간 실시간 상호작용을 처리하는 핵심 로직의 정상 동작을 검증.
 */
public class ChatServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ChatRoomRepository chatRoomRepository;
    @Mock private ProductRepository productRepository;
    @Mock private ChatMessageRepository chatMessageRepository;

    @InjectMocks
    private ChatServiceImpl chatService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * 1. 채팅방 생성 성공 (initiateChat_success)
     *    - 상품을 기준으로 요청자와 게시자 간 새로운 채팅방을 성공적으로 생성하는지 확인.
     */
    @Test
    @DisplayName("채팅방 생성 성공")
    void initiateChat_success() {
        Long productId = 1L;
        Long requesterId = 2L;

        User requester = User.builder().id(requesterId).name("요청자").build();
        User owner = User.builder().id(1L).name("상품주인").build();
        Product product = Product.builder().id(productId).owner(owner).build();

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(userRepository.findById(requesterId)).thenReturn(Optional.of(requester));
        when(chatRoomRepository.findByProductAndParticipants(productId, owner.getId(), requesterId)).thenReturn(Optional.empty());
        when(chatRoomRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        var result = chatService.initiateChatFromPost(productId, requesterId);

        assertThat(result.getProduct().getId()).isEqualTo(productId);
    }

    /**
     * 2. 채팅방 생성 실패 - 자기 자신에게 요청 (initiateChat_fail_ownProduct)
     *    - 사용자가 자신의 상품에 대해 채팅 요청을 시도할 경우 예외가 발생하는지 확인합니다.
     */
    @Test
    @DisplayName("메시지 저장 성공")
    void saveMessage_success() {
        Long roomId = 1L;
        String email = "user@example.com";
        ChatMessageRequest request = new ChatMessageRequest();
        request.setChatRoomId(roomId);
        request.setContent("안녕하세요");
        request.setType(ChatMessageType.TEXT);

        ChatRoom chatRoom = ChatRoom.builder().id(roomId).build();
        User sender = User.builder().email(email).name("홍길동").build();

        when(chatRoomRepository.findById(roomId)).thenReturn(Optional.of(chatRoom));
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(sender));
        when(chatMessageRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        ChatMessageResponse response = chatService.saveMessage(request, email);

        assertThat(response.getContent()).isEqualTo("안녕하세요");
        assertThat(response.getChatMessageType()).isEqualTo(ChatMessageType.TEXT.toString());

    }

    /**
     * 3. 메시지 저장 성공 (saveMessage_success)
     *    - 채팅방과 사용자 정보가 올바를 때, 메시지가 정상적으로 저장되고 응답으로 변환되는지 검증합니다.
     */
    @Test
    @DisplayName("채팅방 생성 실패 - 자기 자신의 상품")
    void initiateChat_fail_ownProduct() {
        Long productId = 1L;
        Long requesterId = 1L; // 동일 ID

        User owner = User.builder().id(requesterId).build();
        Product product = Product.builder().id(productId).owner(owner).build();

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> chatService.initiateChatFromPost(productId, requesterId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("자신의 상품에 대해 채팅방을 생성할 수 없습니다");
    }

    /**
     * 4. 메시지 저장 실패 - 유저 없음 (saveMessage_fail_userNotFound)
     *    - 존재하지 않는 유저의 이메일로 메시지를 저장하려 할 때 예외가 발생하는지 확인합니다.
     */
    @Test
    @DisplayName("메시지 저장 실패 - 유저 없음")
    void saveMessage_fail_userNotFound() {
        Long roomId = 1L;
        String email = "user@example.com";

        ChatMessageRequest request = new ChatMessageRequest();
        request.setChatRoomId(roomId);
        request.setContent("메시지");
        request.setType(ChatMessageType.TEXT);

        when(chatRoomRepository.findById(roomId)).thenReturn(Optional.of(new ChatRoom()));
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> chatService.saveMessage(request, email))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("유저 정보가 존재하지 않습니다");
    }
}

