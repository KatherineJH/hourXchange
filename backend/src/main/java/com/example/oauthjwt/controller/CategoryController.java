package com.example.oauthjwt.controller;

import com.example.oauthjwt.util.LocationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.service.CategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final LocationUtil locationUtil;
    // 전체 조회
    @GetMapping("/list")
    public ResponseEntity<Page<CategoryResponse>> findAll(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<CategoryResponse> result = categoryService.findAll(pageable);
        return ResponseEntity.ok(result);
    }
    // 저장
    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> create(@RequestParam String categoryName) {
        CategoryResponse result = categoryService.addCategory(categoryName);

        return ResponseEntity.created(locationUtil.createdLocation(result.getId())).body(result);
    }
    // 조회
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> findById(@PathVariable Long id) {
        CategoryResponse result = categoryService.findById(id);
        return ResponseEntity.ok(result);
    }
    // 수정
    @PutMapping("/modify/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @RequestParam String categoryName) {
        CategoryResponse result = categoryService.updateCategory(id, categoryName);
        return ResponseEntity.ok(result);
    }
    // 삭제
    @PutMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> delete(@PathVariable Long id) {
        CategoryResponse result = categoryService.deleteCategory(id);

        return ResponseEntity.ok(result);
    }
}
