package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.service.BoardService;
import com.example.oauthjwt.service.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.when;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.security.test.context.support.WithMockUser;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = BoardController.class)
class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BoardService boardService;

    @Autowired
    private ObjectMapper objectMapper;

    // 테스트용 사용자 mock
    private CustomUserDetails mockUserDetails(Long userId) {
        User mockUser = User.builder()
                .id(userId)
                .email("mock@user.com")
                .password("password")
                .role(UserRole.ROLE_USER)  // enum Role.USER 를 사용한 경우
                .build();

        return new CustomUserDetails(mockUser);
    }

    @Test
    @WithMockUser
    void findById_shouldReturnBoardResponse() throws Exception {
        // given
        Long boardId = 1L;
        Long userId = 100L;

        BoardResponse mockResponse = BoardResponse.builder()
                .id(boardId)
                .title("Test Title")
                .description("Test Description")
                .likeCount(5L)
                .likedByMe(true)
                .build();

        when(boardService.findById(Mockito.eq(boardId), Mockito.eq(userId))).thenReturn(mockResponse);

        // when & then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/board/{id}", boardId)
                        .principal(() -> String.valueOf(userId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(boardId))
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.likedByMe").value(true));
    }
}
