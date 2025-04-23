package com.example.oauthjwt.controller;


import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Log4j2
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @PostMapping("/")
    public ResponseEntity<?> create(@RequestParam String categoryName){
       // try {
            Category category = categoryService.addCategory(categoryName);
            CategoryResponse categoryResponse = CategoryResponse.toDto(category);
            return new ResponseEntity<>(categoryResponse, HttpStatus.CREATED);
       // } catch (Exception e) {
          //  log.error("카테고리 생성 오류",e);
          //  return ResponseEntity.internalServerError().body(ApiResponse.serverError("카테고리 생성 도중 오류 발생"));
        //}
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
          //try{
              Category category = categoryService.findById(id);
              CategoryResponse categoryResponse = CategoryResponse.toDto(category);
              return ResponseEntity.ok(categoryResponse);
          //}catch(IllegalArgumentException e) {
          //}
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestParam String categoryName) {
        Category updatedCategory = categoryService.updateCategory(id, categoryName);
        CategoryResponse categoryResponse = CategoryResponse.toDto(updatedCategory);
        return ResponseEntity.ok(categoryName);
    }
}
