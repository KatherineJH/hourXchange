package com.example.oauthjwt.controller;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.dto.request.TransactionUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.entity.TRANSACTION_STATE;
import com.example.oauthjwt.service.ServiceProductService;
import com.example.oauthjwt.service.TransactionService;
import com.example.oauthjwt.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/transaction")
public class TransactionController {
  private final TransactionService transactionService;

  @PostMapping("/")
  public ResponseEntity<?> save(@RequestBody TransactionRequest transactionRequest) {
    // 검증
    Map<String, String> saveCheck = transactionService.saveCheck(transactionRequest);
    if (!saveCheck.isEmpty()) {
      return ResponseEntity.ok(saveCheck);
    }
    // 조회
    TransactionResponse result = transactionService.createTransaction(transactionRequest);
    // 반환
    return ResponseEntity.ok(result);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> findById(@PathVariable("id") Long id) {
    // 검증
    Map<String, String> existsByIdCheck = transactionService.existsById(id);
    if (!existsByIdCheck.isEmpty()) {
      return ResponseEntity.ok(existsByIdCheck);
    }
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

  @PutMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody TransactionUpdateRequest transactionUpdateRequest) {
    // 검증
    Map<String, String> saveCheck = transactionService.saveCheck(transactionUpdateRequest);
    if (!saveCheck.isEmpty()) {
      return ResponseEntity.ok(saveCheck);
    }
    transactionUpdateRequest.setId(id);

    TransactionResponse result = transactionService.update(transactionUpdateRequest);
    return ResponseEntity.ok(result);
  }

}
