package com.example.oauthjwt.controller;

import java.util.List;

import com.example.oauthjwt.dto.response.PageResult;
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

    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> save(@RequestBody @Valid ProductRequest productRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info(productRequest);
        // 로직 실행
        ProductResponse result = productService.save(productRequest, userDetails);
        // 저장된 값 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> findById(@PathVariable Long productId, HttpServletRequest request,
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

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> update(@PathVariable Long productId, @RequestBody @Valid ProductRequest productRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 로직
        ProductResponse result = productService.update(productRequest, userDetails, productId);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        // 로직 실행
        PageResult<ProductResponse> result = productService.findAll(page, size);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER')")
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
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long productId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FavoriteResponse result = productService.toggleFavorite(productId, userDetails.getUser().getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/favorite/list")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> findAllFavorite(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<FavoriteResponse> result = productService.findAllFavorite(userDetails.getUser().getId());
        return ResponseEntity.ok(result);
    }
}
