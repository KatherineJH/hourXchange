package com.example.oauthjwt.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public Page<CategoryResponse> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(CategoryResponse::toDto);
    }

    @Override
    public Category addCategory(String categoryName) {
        if (categoryRepository.existsByCategoryName(categoryName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 존재하는 카테고리입니다.");
        }
        Category category = Category.builder()
                .categoryName(categoryName)
                .build();
        return categoryRepository.save(category);
    }


    public Category updateCategory(Long id, String categoryName) {
        Optional<Category> category = categoryRepository.findById(id);
        Category existingCategory = category.orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 존재하지 않음"));
        existingCategory.setCategoryName(categoryName);
        return categoryRepository.save(existingCategory);
    }

    @Override
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 카테고리가 존재하지 않습니다."));
    }

}
