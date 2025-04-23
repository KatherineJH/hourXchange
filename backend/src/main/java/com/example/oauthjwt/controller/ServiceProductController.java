package com.example.oauthjwt.controller;

import java.util.List;

import com.example.oauthjwt.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/serviceProduct")
public class ServiceProductController {
  private final ServiceProductService serviceProductService;

  @PostMapping("/")
  public ResponseEntity<?> save(@RequestBody @Valid ServiceProductRequest serviceProductRequest, @AuthenticationPrincipal CustomUserDetails userDetails) {
    // 인증한 유저의 id 값으로 할당
    serviceProductRequest.setOwnerId(userDetails.getUser().getId());

    log.info(serviceProductRequest.toString());
    // 로직 실행
    ServiceProductResponse result = serviceProductService.save(serviceProductRequest);
    // 저장된 값 반환
    return ResponseEntity.ok(result);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> findById(@PathVariable Long id) {
    // 로직 실행
    ServiceProductResponse result = serviceProductService.findById(id);
    // 반환
    return ResponseEntity.ok(result);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> update(
          @PathVariable Long id,
          @RequestBody @Valid ServiceProductRequest serviceProductRequest,
          @AuthenticationPrincipal CustomUserDetails userDetails) {
    if(!userDetails.getUser().getId().equals(serviceProductRequest.getOwnerId())){
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "본인이 등록한 제품만 수정이 가능합니다.");
    }
    // url 주소로 받은 id 값 지정
    serviceProductRequest.setId(id);
    // 로직
    ServiceProductResponse result = serviceProductService.update(serviceProductRequest);
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


}
