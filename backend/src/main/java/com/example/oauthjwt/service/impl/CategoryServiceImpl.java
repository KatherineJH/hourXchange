package com.example.oauthjwt.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import com.example.oauthjwt.entity.Category;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
  private final CategoryRepository categoryRepository;

  @Override
  public List<CategoryResponse> findAll() {
    List<Category> categoryList = categoryRepository.findAll();

    return categoryList.stream().map(CategoryResponse::toDto).collect(Collectors.toList());
  }

  public Category addCategory(String categoryName) {
    Category category = Category.builder()
            .categoryName(categoryName)
            .build();
    return categoryRepository.save(category);
  }

  public Category updateCategory(Long id, String categoryName) {
    Optional<Category> category =categoryRepository.findById(id);
    Category existingCategory=category.orElseThrow(()->new IllegalArgumentException("해당 카테고리가 존재하지 않음"));
    existingCategory.setCategoryName(categoryName);
    return categoryRepository.save(existingCategory);
  }

  public Category findById(Long id) {
    Optional<Category> category = categoryRepository.findById(id);
    return categoryRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("해당 카테고리가 존재하지 않음"));
  }

//  public List<Category> findAll(){
//    return categoryRepository.findAll();
//  }
}