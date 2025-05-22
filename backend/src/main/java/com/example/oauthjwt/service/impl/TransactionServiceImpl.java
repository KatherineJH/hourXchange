package com.example.oauthjwt.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.entity.type.TransactionStatus;
import com.example.oauthjwt.entity.type.WalletATM;
import com.example.oauthjwt.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.service.ChatService;
import com.example.oauthjwt.service.TransactionService;
import com.example.oauthjwt.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final ChatService chatService;
    private final WalletHistoryRepository walletHistoryRepository;
    private final UserService userService;
    private final ChatRoomUserRepository chatRoomUserRepository;

    @Override
    @Transactional
    public TransactionResponse save(TransactionRequest transactionRequest) {
        // 1. 요청자(buyer), 상품(product), 판매자(seller) 조회
        User buyer = userRepository.findById(transactionRequest.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        Product product = productRepository.findById(transactionRequest.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품 정보가 존재하지 않습니다."));
        User seller = product.getOwner();

        // 2. 자기 자신에게 요청 시 에러
        if (buyer.getId().equals(seller.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "자신이 올린 글에는 요청할 수 없습니다.");
        }

        // 3. 상태 검증
        TransactionStatus transactionStatus = TransactionStatus
                .parseTransactionType(transactionRequest.getStatus().toUpperCase());
        if (transactionStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
        }

        // 4. 채팅방 조회
        ChatRoom chatRoom = chatService.findByProductAndUsers(product.getId(), buyer.getId(), seller.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방이 존재하지 않습니다."));

        // 5. 요청자 트랜잭션 생성 및 저장
        Transaction buyerTransaction = Transaction.of(transactionRequest, buyer, product, transactionStatus, chatRoom);
        transactionRepository.save(buyerTransaction);

        // 6. 판매자 트랜잭션 요청 생성
        TransactionRequest sellerRequest = new TransactionRequest();
        sellerRequest.setUserId(seller.getId());
        sellerRequest.setProductId(product.getId());
        sellerRequest.setStatus(transactionRequest.getStatus());

        Transaction sellerTransaction = Transaction.of(sellerRequest, seller, product, transactionStatus, chatRoom);
        transactionRepository.save(sellerTransaction);

        // 7. 요청자 기준으로만 응답 반환
        return TransactionResponse.toDto(buyerTransaction);
    }

    @Override
    public TransactionResponse findById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "트랜잭션 정보가 존재하지 않습니다."));;
        return TransactionResponse.toDto(transaction);
    }

    @Override
    public List<TransactionResponse> findAll() {
        return transactionRepository.findAll().stream().map(TransactionResponse::toDto).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> findByUserId(Long userId) {
        List<Transaction> myTransactions = transactionRepository.findByUserId(userId);

        return myTransactions.stream()
                .map(transaction -> {
                    // 각 트랜잭션마다 해당 트랜잭션의 상대방을 찾음
                    Transaction opponent = transactionRepository.findByChatRoomId(transaction.getChatRoom().getId()).stream()
                            .filter(t -> t.getProduct().getId().equals(transaction.getProduct().getId()) &&
                                    !t.getUser().getId().equals(userId))
                            .findFirst()
                            .orElse(null);

                    return TransactionResponse.toDto(transaction, opponent);
                })
                .collect(Collectors.toList());
    }

    @Override
    public TransactionResponse update(TransactionRequest transactionRequest) {
        // 검증
        Transaction transaction = transactionRepository.findById(transactionRequest.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "트랜잭션 정보가 존재하지 않습니다."));
        User user = userRepository.findById(transactionRequest.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        Product product = productRepository.findById(transactionRequest.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품 정보가 존재하지 않습니다."));
        // 값 업데이트
        TransactionStatus transactionStatus = TransactionStatus
                .parseTransactionType(transactionRequest.getStatus().toUpperCase());
        // 저장 및 반환
        Transaction result = transactionRepository
                .save(transaction.setUpdateValue(transactionRequest, user, product, transactionStatus));
        return TransactionResponse.toDto(result);
    }

    @Override
    @Transactional
    public void updateTransactionStatusToRequested(Long chatRoomId, Long requesterId) {
        ChatRoom chatRoom = chatService.findById(chatRoomId);
        Long productId = chatRoom.getProduct().getId();
        User owner = chatRoom.getProduct().getOwner();
        User user = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        ChatRoomUser chatRoomUser = chatRoomUserRepository.findByChatRoomAndUser(chatRoom, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품 정보가 존재하지 않습니다."));

        List<Transaction> transactions = transactionRepository.findByChatRoomId(chatRoomId);
        for (Transaction transaction : transactions) {
            if (transaction.getStatus() == TransactionStatus.PENDING) {
                transaction.setStatus(TransactionStatus.REQUESTED);
                transactionRepository.save(transaction);
            }
        }
    }

    @Override
    @Transactional
    public void updateTransactionStatusToAccepted(Long chatRoomId) {
        ChatRoom chatRoom = chatService.findById(chatRoomId);
        Product product = chatRoom.getProduct();
        ProviderType type = product.getProviderType();
        int hours = product.getHours();

        User owner = product.getOwner();
        User opponent = product.getOwner();

        // 트랜잭션 상태 변경
        List<Transaction> transactions = transactionRepository.findByChatRoomId(chatRoomId);
        for (Transaction transaction : transactions) {
            if (transaction.getStatus() == TransactionStatus.REQUESTED) {
                transaction.setStatus(TransactionStatus.ACCEPTED);
                transactionRepository.save(transaction);
            }
        }

        // 크레딧 차감 로직 ONLY
        try {
            if (type == ProviderType.SELLER) {
                opponent.subtractCredit(hours);
                walletHistoryRepository.save(WalletHistory.builder()
                        .wallet(opponent.getWallet())
                        .product(product)
                        .type(WalletATM.SPEND)
                        .amount(hours)
                        .balance(opponent.getWallet().getCredit())
                        .createdAt(LocalDateTime.now())
                        .build());

            } else if (type == ProviderType.BUYER) {
                owner.subtractCredit(hours);
                walletHistoryRepository.save(WalletHistory.builder()
                        .wallet(owner.getWallet())
                        .product(product)
                        .type(WalletATM.SPEND)
                        .amount(hours)
                        .balance(opponent.getWallet().getCredit())
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "크레딧이 부족합니다.");
        }
    }

    @Transactional
    @Override
    public void completeTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "트랜잭션이 존재하지 않습니다."));

        // 같은 chatRoomId, productId 를 가진 짝 트랜잭션 모두 조회
        List<Transaction> pair = transactionRepository.findByChatRoomId(transaction.getChatRoom().getId())
                .stream()
                .filter(t -> t.getProduct().getId().equals(transaction.getProduct().getId()))
                .collect(Collectors.toList());

        for (Transaction t : pair) {
            if (t.getStatus() == TransactionStatus.ACCEPTED) {
                t.setStatus(TransactionStatus.COMPLETED);
                transactionRepository.save(t);
            }
        }
        // 지급 대상 계산
        Product product = transaction.getProduct();
        int hours = product.getHours();
        ProviderType type = product.getProviderType();
        User giver = (type == ProviderType.SELLER) ? transaction.getUser() : product.getOwner();
        User receiver = (type == ProviderType.SELLER) ? product.getOwner() : transaction.getUser();

        // 크레딧 지급
        receiver.addCredit(hours);
        walletHistoryRepository.save(WalletHistory.builder()
                .wallet(receiver.getWallet())
                .product(product)
                .type(WalletATM.EARN)
                .amount(hours)
                .balance(receiver.getWallet().getCredit())
                .createdAt(LocalDateTime.now())
                .build());
    }
}
