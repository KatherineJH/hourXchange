package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceTest {

    private CategoryRepository categoryRepository;
    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        categoryRepository = mock(CategoryRepository.class);
        categoryService = new CategoryServiceImpl(categoryRepository);
    }

    @Test
    @DisplayName("모든 카테고리 조회")
    void findAll_success() {
        // given
        Category c1 = Category.builder().id(1L).categoryName("운동").build();
        Category c2 = Category.builder().id(2L).categoryName("청소").build();
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(c1, c2));

        // when
        List<CategoryResponse> result = categoryService.findAll();

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getCategoryName()).isEqualTo("운동");
    }

    @Test
    @DisplayName("카테고리 등록 성공")
    void addCategory_success() {
        // given
        String categoryName = "봉사";
        when(categoryRepository.existsByCategoryName(categoryName)).thenReturn(false);
        when(categoryRepository.save(any())).thenAnswer(i -> {
            Category c = i.getArgument(0);
            c.setId(1L);
            return c;
        });

        // when
        Category result = categoryService.addCategory(categoryName);

        // then
        assertThat(result.getCategoryName()).isEqualTo("봉사");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    @DisplayName("중복된 카테고리 등록 실패")
    void addCategory_fail_duplicate() {
        // given
        when(categoryRepository.existsByCategoryName("음악")).thenReturn(true);

        // expect
        assertThatThrownBy(() -> categoryService.addCategory("음악"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("이미 존재하는 카테고리입니다.");
    }

    @Test
    @DisplayName("카테고리 ID로 조회 성공")
    void findById_success() {
        // given
        Category category = Category.builder().id(1L).categoryName("청소").build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        // when
        Category result = categoryService.findById(1L);

        // then
        assertThat(result.getCategoryName()).isEqualTo("청소");
    }

    @Test
    @DisplayName("카테고리 ID로 조회 실패")
    void findById_fail_notFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.findById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("해당 카테고리가 존재하지 않습니다.");
    }

    @Test
    @DisplayName("카테고리 이름 수정 성공")
    void updateCategory_success() {
        // given
        Category old = Category.builder().id(1L).categoryName("운").build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(old));
        when(categoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // when
        Category updated = categoryService.updateCategory(1L, "운동");

        // then
        assertThat(updated.getCategoryName()).isEqualTo("운동");
    }

    @Test
    @DisplayName("카테고리 수정 실패 - ID 존재하지 않음")
    void updateCategory_fail_notFound() {
        when(categoryRepository.findById(123L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.updateCategory(123L, "기타"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("해당 카테고리가 존재하지 않음");
    }
}
