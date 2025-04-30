package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;

public interface CategoryService {

  List<CategoryResponse> findAll();

  // Map<String, String> existsById(Long id);
  Category addCategory(String categoryName);

  Category updateCategory(Long id, String categoryName);

  Category findById(Long id);
  // List<Category> findAll();
}
