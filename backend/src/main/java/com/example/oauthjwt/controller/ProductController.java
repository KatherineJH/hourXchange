package com.example.oauthjwt.controller;

import java.util.List;

import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.dto.response.UserTagResponse;
import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    private final ReviewService reviewService;

    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ProductResponse> save(@RequestBody @Valid ProductRequest productRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info(productRequest);
        // 로직 실행
        ProductResponse result = productService.save(productRequest, userDetails);
        // 저장된 값 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> findById(@PathVariable Long productId, HttpServletRequest request,
                                      @AuthenticationPrincipal CustomUserDetails userDetails) {

        // 인증된 유저면 userId, 아니면 클라이언트 IP
        String userKey = (userDetails != null)
                ? "user:" + userDetails.getUser().getId()
                : "ip:"   + request.getRemoteAddr();

        // 로직 실행
        ProductResponse result = productService.findById(productId, userKey);
        // 반환
        return ResponseEntity.ok(result);
    }

    @PutMapping("/modify/{productId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ProductResponse> update(@PathVariable Long productId, @RequestBody @Valid ProductRequest productRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 로직
        ProductResponse result = productService.update(productRequest, userDetails, productId);
        // 반환
        return ResponseEntity.ok(result);
    }

    @PutMapping("/delete/{productId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ProductResponse> delete(@PathVariable Long productId,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 로직
        ProductResponse result = productService.delete(userDetails, productId);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list/all")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        // 로직 실행
        PageResult<ProductResponse> result = productService.findAll(page, size);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getFilteredList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String providerType
    ) {
        try {
            ProviderType type = providerType != null ? ProviderType.valueOf(providerType.toUpperCase()) : null;

            Page<ProductResponse> response = productService.getFilteredList(page, size, type);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid providerType: " + providerType);
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Page<ProductResponse>> findMyProducts(@AuthenticationPrincipal CustomUserDetails userDetails,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProductResponse> result = productService.findByOwnerId(userDetails.getUser().getId(), pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/listMap")
    public ResponseEntity<List<ProductResponse>> findAllWithPosition(@RequestParam(defaultValue = "37.563588758399376") double swLat,
                                                 @RequestParam(defaultValue = "126.97429553373962") double swLng,
                                                 @RequestParam(defaultValue = "37.56899604971747") double neLat,
                                                 @RequestParam(defaultValue = "126.9812890557788") double neLng) {
        log.info("prams swLat:{} swLng:{} neLat:{} neLng:{}", swLat, swLng, neLat, neLng);
        List<ProductResponse> productResponseList = productService.findAllWithPosition(swLat, swLng, neLat, neLng);
        return ResponseEntity.ok(productResponseList);
    }

    @PostMapping("/favorite/{productId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<FavoriteResponse> toggleFavorite(@PathVariable Long productId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FavoriteResponse result = productService.toggleFavorite(productId, userDetails.getUser().getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/favorite/list")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<FavoriteResponse>> findAllFavorite(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<FavoriteResponse> result = productService.findAllFavorite(userDetails.getUser().getId());
        return ResponseEntity.ok(result);
    }

    // 전체 태그 키워드 받아오기
    @GetMapping("/user/{userId}/tags")
    public ResponseEntity<List<UserTagResponse>> getUserTags(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserTags(userId));
    }
    // 상품에 선택된 태그 키워드 받아오기
    @GetMapping("/{productId}/tags")
    public ResponseEntity<List<String>> getProductTags(@PathVariable Long productId) {
        return ResponseEntity.ok(
                productService.findById(productId, "internal").getTags()
        );
    }
}
