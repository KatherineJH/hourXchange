package com.example.oauthjwt.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.response.CategoryResponse;

public interface CategoryService {

    Page<CategoryResponse> findAll(Pageable pageable);

    CategoryResponse addCategory(String categoryName);

    CategoryResponse updateCategory(Long id, String categoryName);

    CategoryResponse findById(Long id);

    CategoryResponse deleteCategory(Long id);
}
