package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.entity.Category;
import com.example.oauthjwt.interceptor.VisitLogInterceptor;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebMvcTest(CategoryController.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @MockBean
    private CategoryRepository categoryRepository;

    @MockBean
    private VisitLogInterceptor visitLogInterceptor;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("전체 카테고리 조회 성공")
    @WithMockUser
    void getAllCategories() throws Exception {
        CategoryResponse res1 = new CategoryResponse(1L, "운동");
        CategoryResponse res2 = new CategoryResponse(2L, "음악");
        List<CategoryResponse> categories = Arrays.asList(res1, res2);

        // Page 객체로 감싸기
        Page<CategoryResponse> page = new PageImpl<>(categories);

        // Pageable 인자를 명시적으로 설정하거나 any(Pageable.class) 사용
        when(categoryService.findAll(any(Pageable.class))).thenReturn(page);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        mockMvc.perform(get("/api/category/list")
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].categoryName").value("운동"))
                .andExpect(jsonPath("$.content[1].id").value(2L))
                .andExpect(jsonPath("$.content[1].categoryName").value("음악"));
    }

    @Test
    @DisplayName("카테고리 ID로 조회 성공")
    @WithMockUser
    void getCategoryById() throws Exception {
        Category cat = new Category();
        cat.setId(1L);
        cat.setCategoryName("운동");

        when(categoryService.findById(1L)).thenReturn(cat);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        mockMvc.perform(get("/api/category/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.categoryName").value("운동"));
    }

    @Test
    @DisplayName("카테고리 생성 성공")
    @WithMockUser(roles = "ADMIN")
    void createCategory() throws Exception {
        Category cat = new Category();
        cat.setId(1L);
        cat.setCategoryName("운동");

        when(categoryService.addCategory("운동")).thenReturn(cat);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        mockMvc.perform(post("/api/category/")
                        .param("categoryName", "운동")
                        .with(csrf())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.categoryName").value("운동"));
    }

    @Test
    @DisplayName("카테고리 수정 성공")
    @WithMockUser(roles = "ADMIN")
    void updateCategory() throws Exception {
        Category updated = new Category();
        updated.setId(1L);
        updated.setCategoryName("헬스");

        when(categoryService.updateCategory(1L, "헬스")).thenReturn(updated);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        mockMvc.perform(put("/api/category/1")
                        .param("categoryName", "헬스")
                        .with(csrf())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.categoryName").value("헬스"));
    }
}
