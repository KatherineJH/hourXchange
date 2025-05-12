package com.example.oauthjwt.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.FavoriteResponse;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.service.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/product")
public class ProductController {
    private final ProductService productService;

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody @Valid ProductRequest productRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 인증한 유저의 id 값으로 할당
        productRequest.setOwnerId(userDetails.getUser().getId());

        log.info(productRequest.toString());
        // 로직 실행
        ProductResponse result = productService.save(productRequest);
        // 저장된 값 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        // 로직 실행
        ProductResponse result = productService.findById(id);
        // 반환
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody @Valid ProductRequest productRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!userDetails.getUser().getId().equals(productRequest.getOwnerId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "본인이 등록한 제품만 수정이 가능합니다.");
        }
        // url 주소로 받은 id 값 지정
        productRequest.setId(id);
        // 로직
        ProductResponse result = productService.update(productRequest);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending()); // ✅ 최신순 정렬

        // 로직 실행
        Page<ProductResponse> result = productService.findAll(pageable);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<?> findMyProducts(@AuthenticationPrincipal CustomUserDetails userDetails,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending());
        Page<ProductResponse> result = productService.findByOwnerId(userDetails.getUser().getId(), pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/listMap")
    public ResponseEntity<?> findAllWithPosition(@RequestParam(defaultValue = "37.496486063") double lat,
            @RequestParam(defaultValue = "127.028361548") double lng) {
        List<ProductResponse> productResponseList = productService.findAllWithPosition(lat, lng);
        return ResponseEntity.ok(productResponseList);
    }

    @PostMapping("/favorite/{productId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long productId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FavoriteResponse result = productService.toggleFavorite(productId, userDetails.getUser().getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/favorite/list")
    public ResponseEntity<?> findAllFavorite(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<FavoriteResponse> result = productService.findAllFavorite(userDetails.getUser().getId());
        return ResponseEntity.ok(result);
    }
}
