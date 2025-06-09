package com.example.oauthjwt.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public Page<CategoryResponse> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(CategoryResponse::toDto);
    }

    @Override
    public CategoryResponse addCategory(String categoryName) {
        if (categoryRepository.existsByCategoryName(categoryName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 카테고리 이름입니다.");
        }
        Category category = Category.of(categoryName);

        return CategoryResponse.toDto(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(Long id, String categoryName) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));

        if (categoryRepository.existsByCategoryName(categoryName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 카테고리 이름입니다.");
        }

        category.updateCategory(categoryName);
        return CategoryResponse.toDto(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse findById(Long id) {
        Category result = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 카테고리가 존재하지 않습니다."));
        return CategoryResponse.toDto(result);
    }

    @Override
    public CategoryResponse deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 카테고리가 존재하지 않습니다."));
        category.deleteCategory();
        return CategoryResponse.toDto(categoryRepository.save(category));
    }

}
