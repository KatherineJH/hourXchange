package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    @DisplayName("findAll: repository에서 가져온 엔티티를 DTO 리스트로 변환")
    void findAll_ReturnsDtoList() {
        // given
        Category c1 = Category.builder().id(1L).categoryName("A").status(true).build();
        Category c2 = Category.builder().id(2L).categoryName("B").status(true).build();
        Pageable pageable = PageRequest.of(0, 10);

        given(categoryRepository.findAll(any(Pageable.class)))
                .willReturn(new PageImpl<>(List.of(c1, c2))); // ← 수정된 부분

        // when
        Page<CategoryResponse> result = categoryService.findAll(pageable);

        // then
        assertThat(result).hasSize(2)
                .extracting(CategoryResponse::getCategoryName)
                .containsExactly("A", "B");
    }

    @Test
    @DisplayName("addCategory: 새로운 카테고리 저장 성공")
    void addCategory_Success() {
        // given
        String name = "NewCat";
        given(categoryRepository.existsByCategoryName(name)).willReturn(false);
        Category saved = Category.builder().id(3L).categoryName(name).build();
        given(categoryRepository.save(any(Category.class))).willReturn(saved);

        // when
        CategoryResponse result = categoryService.addCategory(name);

        // then
        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getCategoryName()).isEqualTo(name);
        then(categoryRepository).should().save(argThat(c -> c.getCategoryName().equals(name)));
    }

    @Test
    @DisplayName("addCategory: 중복 카테고리 이름일 때 예외")
    void addCategory_DuplicateName_Throws() {
        // given
        String name = "DupCat";
        given(categoryRepository.existsByCategoryName(name)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> categoryService.addCategory(name))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); // ← 여기 수정
                    assertThat(rse.getReason()).contains("이미 존재하는 카테고리");
                });
    }

    @Test
    @DisplayName("updateCategory: 존재하는 카테고리 이름 수정 성공")
    void updateCategory_Success() {
        // given
        Long id = 4L;
        String newName = "Updated";
        Category existing = Category.builder().id(id).categoryName("Old").build();
        given(categoryRepository.findById(id)).willReturn(Optional.of(existing));
        Category saved = Category.builder().id(id).categoryName(newName).build();
        given(categoryRepository.save(any(Category.class))).willReturn(saved);

        // when
        CategoryResponse result = categoryService.updateCategory(id, newName);

        // then
        assertThat(result.getCategoryName()).isEqualTo(newName);
        then(categoryRepository).should().save(argThat(c -> c.getId().equals(id)
                && c.getCategoryName().equals(newName)));
    }

    @Test
    @DisplayName("updateCategory: 존재하지 않는 카테고리일 때 예외")
    void updateCategory_NotFound_Throws() {
        // given
        given(categoryRepository.findById(99L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> categoryService.updateCategory(99L, "X"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(rse.getReason()).isEqualTo("카테고리 정보가 존재하지 않습니다.");
                });
    }

    @Test
    @DisplayName("findById: 존재하는 ID 조회 성공")
    void findById_Success() {
        // given
        Long id = 5L;
        Category c = Category.builder().id(id).categoryName("C").build();
        given(categoryRepository.findById(id)).willReturn(Optional.of(c));

        // when
        CategoryResponse result = categoryService.findById(id);

        // then
        assertThat(result.getId()).isEqualTo(c.getId());
        assertThat(result.getCategoryName()).isEqualTo(c.getCategoryName());
        assertThat(result.isStatus()).isEqualTo(c.isStatus());
    }

    @Test
    @DisplayName("findById: 없는 ID 조회 시 예외")
    void findById_NotFound_Throws() {
        // given
        given(categoryRepository.findById(100L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> categoryService.findById(100L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(rse.getReason()).contains("해당 카테고리가 존재하지 않습니다");
                });
    }
}
