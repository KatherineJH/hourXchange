package com.example.oauthjwt.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.request.ServiceProductUpdateRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;
import com.example.oauthjwt.entity.ProviderType;
import com.example.oauthjwt.service.CategoryService;
import com.example.oauthjwt.service.CustomUserDetails;
import com.example.oauthjwt.service.ServiceProductService;
import com.example.oauthjwt.service.UserService;
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
  private final SPImageServiceImpl spImageServiceImpl;

  @PostMapping("/")
  public ResponseEntity<?> save(@RequestBody ServiceProductRequest serviceProductRequest) {
    log.info(serviceProductRequest);
    // 사용자가 있는지 조회
    Map<String, String> userCheck = userService.existsById(serviceProductRequest.getOwnerId());
    if (!userCheck.isEmpty()) { // 등록한 사용자의 id가 존재하지 않으면
      return ResponseEntity.badRequest().body(userCheck);
    }
    // 카테고리가 있는지 조회
    Map<String, String> categoryCheck =
        categoryService.existsById(serviceProductRequest.getCategoryId());
    if (!categoryCheck.isEmpty()) { // 카테고리 id 값을 통해 값이 존재 하지 않으면
      return ResponseEntity.badRequest().body(categoryCheck);
    }
    // 이미지 주소가 이미 있는지 조회
    for (int i = 0; i < serviceProductRequest.getImages().size(); i++) {
      Map<String, String> existsByImgUrlCheck =
          spImageServiceImpl.existsByImgUrl(serviceProductRequest.getImages().get(i));
      if (!existsByImgUrlCheck.isEmpty()) {
        return ResponseEntity.badRequest().body(existsByImgUrlCheck);
      }
    }
    // 타입이 있는지 조회
    Map<String, String> ProviderTypeCheck =
        ProviderType.existsByValue(serviceProductRequest.getProviderType());
    if (!ProviderTypeCheck.isEmpty()) { // 타입이 enum 항목에 존재하지 않으면
      return ResponseEntity.badRequest().body(ProviderTypeCheck);
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

    ServiceProductResponse result = serviceProductService.findById(id);

    return ResponseEntity.ok(result);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> update(
      @PathVariable Long id,
      @RequestBody ServiceProductUpdateRequest serviceProductUpdateRequest,
      @AuthenticationPrincipal CustomUserDetails userDetails) {
    // 제품이 있는지 조회
    Map<String, String> serviceProductCheck = serviceProductService.existsById(id);
    if (!serviceProductCheck.isEmpty()) {
      return ResponseEntity.badRequest().body(serviceProductCheck);
    }
    // 요청한 사용자와 토큰에 등록된 사용자가 같은지 조회
    Map<String, String> userCheck =
        userService.isEquals(
            serviceProductUpdateRequest.getOwnerId(), userDetails.getUser().getId());
    if (!userCheck.isEmpty()) { // 요청한 사용자와 쿠키를 통해 가져온 사용자의 아이디가 다른경우
      return ResponseEntity.badRequest().body(userCheck);
    }

    serviceProductUpdateRequest.setId(id); // url 주소로 받은 id 값 지정
    ServiceProductResponse result = serviceProductService.update(serviceProductUpdateRequest);

    return ResponseEntity.ok(result);
  }
}
