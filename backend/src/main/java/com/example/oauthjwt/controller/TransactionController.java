package com.example.oauthjwt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.service.CustomUserDetails;
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
  public ResponseEntity<?> save(@RequestBody @Valid TransactionRequest transactionRequest,
      @AuthenticationPrincipal CustomUserDetails userDetails) {
    // 인증한 유저의 id 값으로 할당
    transactionRequest.setUserId(userDetails.getUser().getId());
    log.info(transactionRequest);
    // 저장
    TransactionResponse result = transactionService.save(transactionRequest);
    // 반환
    return ResponseEntity.ok(result);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> findById(@PathVariable("id") Long id) {
    // 조회
    TransactionResponse result = transactionService.findById(id);
    // 반환
    return ResponseEntity.ok(result);
  }

  @GetMapping("/list")
  public ResponseEntity<?> findAll() {
    List<TransactionResponse> transactionResponseList = transactionService.findAll();
    return ResponseEntity.ok(transactionResponseList);
  }

  @GetMapping("/my")
  public ResponseEntity<?> findMyTransactions(@AuthenticationPrincipal CustomUserDetails userDetails) {
    Long userId = userDetails.getUser().getId();
    List<TransactionResponse> myTransactions = transactionService.findByUserId(userId);
    return ResponseEntity.ok(myTransactions);
  }

  // @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody TransactionRequest transactionRequest,
      @AuthenticationPrincipal CustomUserDetails userDetails) {
    transactionRequest.setId(id);

    TransactionResponse result = transactionService.update(transactionRequest);
    return ResponseEntity.ok(result);
  }
}
