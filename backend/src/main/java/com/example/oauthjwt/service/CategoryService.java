package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {

    Page<CategoryResponse> findAll(Pageable pageable);

    Category addCategory(String categoryName);

    Category updateCategory(Long id, String categoryName);

    Category findById(Long id);
}
