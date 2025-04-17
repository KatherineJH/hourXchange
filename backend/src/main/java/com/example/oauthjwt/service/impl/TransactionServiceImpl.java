package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.TransactionReqDTO;
import com.example.oauthjwt.dto.TransactionResDTO;
import com.example.oauthjwt.entity.ServiceProduct;
import com.example.oauthjwt.entity.TRANSACTION_STATE;
import com.example.oauthjwt.entity.Transaction;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.ServiceProductRepository;
import com.example.oauthjwt.repository.TransactionRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final UserRepository userRepository;
    private final ServiceProductRepository serviceProductRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public TransactionResDTO createTransaction(TransactionReqDTO transactionReqDTO) {
        User user = userRepository.findById(transactionReqDTO.getUserId()).get();
        ServiceProduct serviceProduct = serviceProductRepository.findById(transactionReqDTO.getProductId()).get();

        Transaction transaction = Transaction.builder()
                .user(user)
                .product(serviceProduct)
                .status(TRANSACTION_STATE.valueOf(transactionReqDTO.getTransactionState().toUpperCase()))
                .createdAt(LocalDateTime.now())
                .build();

        Transaction result = transactionRepository.save(transaction);

        return TransactionResDTO.toDto(result);
    }
}
