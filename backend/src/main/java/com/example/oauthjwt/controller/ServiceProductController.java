package com.example.oauthjwt.controller;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.request.ServiceProductUpdateRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;
import com.example.oauthjwt.entity.ProviderType;
import com.example.oauthjwt.service.impl.SPImageServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/serviceProduct")
public class ServiceProductController {
  private final ServiceProductService serviceProductService;
  private final CategoryService categoryService;
  private final UserService userService;

  @PostMapping("/")
  public ResponseEntity<?> save(@RequestBody ServiceProductRequest serviceProductRequest) {
    log.info(serviceProductRequest);
    // 입력 값 검증
    Map<String, String> saveCheck = serviceProductService.saveCheck(serviceProductRequest);
    if (!saveCheck.isEmpty()) {
      return ResponseEntity.badRequest().body(saveCheck);
    }
    // 로직 실행
    ServiceProductResponse result = serviceProductService.save(serviceProductRequest);
    // 저장된 값 반환
    return ResponseEntity.ok(result);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> findById(@PathVariable Long id) {
    // 제품이 있는지 조회
    Map<String, String> serviceProductCheck = serviceProductService.existsById(id);
    if (!serviceProductCheck.isEmpty()) {
      return ResponseEntity.badRequest().body(serviceProductCheck);
    }
    // 로직 실행
    ServiceProductResponse result = serviceProductService.findById(id);
    // 반환
    return ResponseEntity.ok(result);
  }

  @GetMapping("/list")
  public ResponseEntity<?> findAll() {
    // 로직 실행
    List<ServiceProductResponse>  serviceProductResponseList = serviceProductService.findAll();
    // 반환
    return ResponseEntity.ok(serviceProductResponseList);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> update(
      @PathVariable Long id,
      @RequestBody ServiceProductUpdateRequest serviceProductUpdateRequest,
      @AuthenticationPrincipal CustomUserDetails userDetails) {
    // url 주소로 받은 id 값 지정
    serviceProductUpdateRequest.setId(id);
    // 검증
    Map<String, String> updateCheck = serviceProductService.updateCheck(serviceProductUpdateRequest, userDetails);
    if (!updateCheck.isEmpty()) {
      return ResponseEntity.badRequest().body(updateCheck);
    }
    // 로직
    ServiceProductResponse result = serviceProductService.update(serviceProductUpdateRequest);
    // 반환
    return ResponseEntity.ok(result);
  }
}
