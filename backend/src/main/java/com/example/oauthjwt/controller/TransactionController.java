package com.example.oauthjwt.controller;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.dto.condition.TransactionSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.example.oauthjwt.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<TransactionResponse> save(@RequestBody @Valid TransactionRequest transactionRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info(transactionRequest);
        // 저장
        TransactionResponse result = transactionService.save(transactionRequest, userDetails);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{transactionId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<TransactionResponse> findById(@PathVariable("transactionId") Long transactionId) {
        // 조회
        TransactionResponse result = transactionService.findById(transactionId);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Page<TransactionResponse>> findAll(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<TransactionResponse> transactionResponseList = transactionService.findAll(pageable);
        return ResponseEntity.ok(transactionResponseList);
    }

    @GetMapping("/search/list")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Page<TransactionResponse>> search(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size,
                                                            @ModelAttribute TransactionSearchCondition transactionSearchCondition) {
        log.info(transactionSearchCondition);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<TransactionResponse> transactionResponseList = transactionService.search(pageable, transactionSearchCondition);
        return ResponseEntity.ok(transactionResponseList);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<TransactionResponse>> findMyTransactions(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getId();
        List<TransactionResponse> myTransactions = transactionService.findByUserId(userId);
        return ResponseEntity.ok(myTransactions);
    }


    @PutMapping("/{transactionId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<TransactionResponse> update(@PathVariable("transactionId") Long transactionId,
                                    @RequestBody @Valid TransactionRequest transactionRequest) {

        TransactionResponse result = transactionService.update(transactionRequest, transactionId);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/complete/{transactionId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Map<String, String>> complete(@PathVariable Long transactionId) {
        transactionService.completeTransaction(transactionId);
        return ResponseEntity.ok(Map.of("message", "거래가 완료되었습니다."));
    }
}
