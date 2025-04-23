package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/category")
@Log4j2
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/list")
    public ResponseEntity<?> findAll() {
        List<CategoryResponse> result = categoryService.findAll();
        return ResponseEntity.ok(result);
    }
}
