package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.entity.type.TransactionStatus;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.impl.TransactionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * TransactionServiceTest는 TransactionServiceImpl 클래스의 거래 처리 기능을 단위 테스트.
 * 각 테스트는 트랜잭션 생성, 유효성 검증, 상태 전이, 크레딧 처리 등 핵심 로직이 예상대로 동작하는지를 검증.
 */
public class TransactionServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;
    @Mock private TransactionRepository transactionRepository;
    @Mock private ChatService chatService;
    @Mock private ChatRoomUserRepository chatRoomUserRepository;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * 1. 거래 생성 성공 (saveTransaction_success)
     *    - 거래 요청자가 상품 등록자와 다르고, 유효한 요청일 때 거래가 저장되고 응답이 생성되는지 검증.
     */
    @Test
    @DisplayName("거래 생성 성공")
    void saveTransaction_success() {
        TransactionRequest request = new TransactionRequest();
        request.setUserId(1L);
        request.setProductId(2L);
        request.setStatus("PENDING");

        User buyer = User.builder().id(1L).build();
        User seller = User.builder().id(2L).build();
        Product product = Product.builder().id(2L).owner(seller).build();
        ChatRoom chatRoom = ChatRoom.builder().id(10L).product(product).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(buyer));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));
        when(chatService.findByProductAndUsers(2L, 1L, 2L)).thenReturn(Optional.of(chatRoom));
        when(transactionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        TransactionResponse result = transactionService.save(request);

        assertThat(result.getProduct().getId()).isEqualTo(2L);
        assertThat(result.getUser().getId()).isEqualTo(1L);
    }

    /**
     * 2. 자기 자신의 상품에 거래 요청 시 예외 발생 (saveTransaction_fail_selfRequest)
     *    - 거래 요청자가 본인의 상품에 요청하는 경우 예외를 던지는지 검증.
     */
    @Test
    @DisplayName("자기 자신에게 요청 시 예외 발생")
    void saveTransaction_fail_selfRequest() {
        TransactionRequest request = new TransactionRequest();
        request.setUserId(1L);
        request.setProductId(2L);
        request.setStatus("PENDING");

        User sameUser = User.builder().id(1L).build();
        Product product = Product.builder().id(2L).owner(sameUser).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sameUser));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> transactionService.save(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("자신이 올린 글에는 요청할 수 없습니다.");
    }

    /**
     *
     * 3. 존재하지 않는 ID로 거래 조회 시 예외 발생 (findById_notFound)
     *    - ID로 거래 조회 시 없을 경우 예외가 발생하는지 확인.
     */
    @Test
    @DisplayName("거래 조회 실패 - 존재하지 않는 ID")
    void findById_notFound() {
        when(transactionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.findById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("트랜잭션 정보가 존재하지 않습니다.");
    }

    /**
     * 4. 거래 상태 REQUESTED로 전환 성공 (updateTransactionStatusToRequested_success)
     *    - PENDING 상태의 거래를 요청 시 REQUESTED 상태로 변경되는지 검증.
     */
    @Test
    @DisplayName("거래 상태 REQUESTED로 업데이트 성공")
    void updateTransactionStatusToRequested_success() {
        Long chatRoomId = 10L;
        Long requesterId = 1L;

        User owner = User.builder().id(2L).build();
        User requester = User.builder().id(1L).build();
        Product product = Product.builder().id(3L).owner(owner).build();
        ChatRoom chatRoom = ChatRoom.builder().id(chatRoomId).product(product).build();
        ChatRoomUser chatRoomUser = ChatRoomUser.of(requester, chatRoom);

        Transaction tx = Transaction.builder()
                .status(TransactionStatus.PENDING)
                .chatRoom(chatRoom)
                .product(product)
                .user(requester)
                .build();

        when(chatService.findById(chatRoomId)).thenReturn(chatRoom);
        when(userRepository.findById(requesterId)).thenReturn(Optional.of(requester));
        when(chatRoomUserRepository.findByChatRoomAndUser(chatRoom, requester)).thenReturn(Optional.of(chatRoomUser));
        when(transactionRepository.findByChatRoomId(chatRoomId)).thenReturn(singletonList(tx));

        transactionService.updateTransactionStatusToRequested(chatRoomId, requesterId);

        assertThat(tx.getStatus()).isEqualTo(TransactionStatus.REQUESTED);
    }

    /**
     * 5. 거래 완료 후 크레딧 지급 처리 (completeTransaction_success)
     *    - ACCEPTED 상태의 거래를 완료 처리 시, 공급자에게 크레딧이 정상적으로 지급되는지 확인.
     */
    @Test
    @DisplayName("거래 완료 후 크레딧 지급")
    void completeTransaction_success() {
        Long transactionId = 1L;

        User buyer = User.builder().id(1L).build();
        Wallet buyerWallet = Wallet.builder().credit(100).user(buyer).build();
        buyer.setWallet(buyerWallet);

        User seller = User.builder().id(2L).build();
        Wallet sellerWallet = Wallet.builder().credit(200).user(seller).build();
        seller.setWallet(sellerWallet);

        Product product = Product.builder().id(10L).owner(seller).hours(5).providerType(ProviderType.SELLER).build();
        ChatRoom chatRoom = ChatRoom.builder().id(5L).product(product).build();

        Transaction tx = Transaction.builder()
                .id(transactionId)
                .product(product)
                .chatRoom(chatRoom)
                .user(buyer)
                .status(TransactionStatus.ACCEPTED)
                .build();

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(tx));
        when(transactionRepository.findByChatRoomId(chatRoom.getId())).thenReturn(List.of(tx));
        when(transactionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        transactionService.completeTransaction(transactionId);

        assertThat(seller.getWallet().getCredit()).isEqualTo(205);
    }
}