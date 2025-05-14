package com.example.oauthjwt.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.ProductRepository;
import com.example.oauthjwt.repository.TransactionRepository;
import com.example.oauthjwt.repository.UserRepository;
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
    private final UserService userService;

    @Override
    @Transactional
    public TransactionResponse save(TransactionRequest transactionRequest) {
        // 1. 요청자 유저와 상품 조회
        User buyer = userRepository.findById(transactionRequest.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        Product product = productRepository.findById(transactionRequest.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품 정보가 존재하지 않습니다."));
        User seller = product.getOwner();

        // 2. 요청자가 자신에게 요청하면 예외
        if (buyer.getId().equals(seller.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "자신이 올린 글에는 요청할 수 없습니다.");
        }

        // 3. 상태 검증
        TransactionStatus transactionStatus = TransactionStatus
                .parseTransactionType(transactionRequest.getStatus().toUpperCase());
        if (transactionStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
        }

        // 4. 요청자 트랜잭션 생성
        Transaction buyerTransaction = Transaction.of(transactionRequest, buyer, product, transactionStatus);
        transactionRepository.save(buyerTransaction);

        // 5. 상품 주인(판매자) 트랜잭션도 함께 생성
        TransactionRequest sellerRequest = new TransactionRequest();
        sellerRequest.setUserId(seller.getId());
        sellerRequest.setProductId(product.getId());
        sellerRequest.setStatus(transactionRequest.getStatus());

        Transaction sellerTransaction = Transaction.of(sellerRequest, seller, product, transactionStatus);
        transactionRepository.save(sellerTransaction);

        // 6. 요청자 기준으로만 응답 반환
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
        List<Transaction> transactions = transactionRepository.findByUserId(userId);

        return transactions.stream().map(TransactionResponse::toDto).collect(Collectors.toList());
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
}
