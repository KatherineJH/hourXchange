package com.example.oauthjwt.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.response.CategoryResponse;
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
}
