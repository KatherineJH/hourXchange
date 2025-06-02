package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.interceptor.VisitLogInterceptor;
import com.example.oauthjwt.service.BoardService;
import com.example.oauthjwt.service.elastic.ElasticSearchService;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = BoardController.class)
class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BoardService boardService;

    @MockBean
    private VisitLogInterceptor visitLogInterceptor;

    @MockBean
    private ElasticSearchService elasticSearchService;

    @Autowired
    private ObjectMapper objectMapper;

    // 테스트용 사용자 mock
    private CustomUserDetails mockUserDetails(Long userId) {
        User mockUser = User.builder()
                .email("mock@user.com")
                .password("password")
                .role(UserRole.ROLE_USER)
                .build();
        mockUser.setId(userId);
        return new CustomUserDetails(mockUser);
    }

    @Test
    @DisplayName("게시물 단건 조회 성공")
    void findById_shouldReturnBoardResponse() throws Exception {
        // given
        Long boardId = 1L;
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        BoardResponse mockResponse = BoardResponse.builder()
                .id(boardId)
                .title("Test Title")
                .description("Test Description")
                .likeCount(5L)
                .likedByMe(true)
                .build();

        when(boardService.findById(boardId, userId)).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(get("/api/board/{id}", boardId)
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(boardId))
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.likedByMe").value(true));
    }

    @Test
    @DisplayName("게시물 생성 성공")
    void save_shouldCreateBoard() throws Exception {
        // given
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        BoardRequest boardRequest = BoardRequest.builder()
                .title("New Board")
                .description("Board Description")
//                .authorId(userId) // Set authorId to match the authenticated user
                .categoryId(1L)   // Set a valid categoryId
                .build();

        BoardResponse mockResponse = BoardResponse.builder()
                .id(1L)
                .title("New Board")
                .description("Board Description")
                .likeCount(0L)
                .likedByMe(false)
                .build();

        when(boardService.save(any(BoardRequest.class), any(CustomUserDetails.class))).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(post("/api/board/")
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(boardRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("New Board"))
                .andExpect(jsonPath("$.description").value("Board Description"));
    }

    @Test
    @DisplayName("전체 게시물 조회 성공")
    void findAllBoards_shouldReturnPagedBoards() throws Exception {
        // given
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        BoardResponse board1 = BoardResponse.builder()
                .id(1L)
                .title("Board 1")
                .description("Description 1")
                .likeCount(3L)
                .likedByMe(false)
                .build();

        BoardResponse board2 = BoardResponse.builder()
                .id(2L)
                .title("Board 2")
                .description("Description 2")
                .likeCount(5L)
                .likedByMe(true)
                .build();

        List<BoardResponse> boardList = Arrays.asList(board1, board2);
        Page<BoardResponse> mockPage = new PageImpl<>(boardList, PageRequest.of(0, 10), boardList.size());

        when(boardService.findAllBoards(any(Pageable.class))).thenReturn(mockPage);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(get("/api/board/all")
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].title").value("Board 1"))
                .andExpect(jsonPath("$.content[1].id").value(2L))
                .andExpect(jsonPath("$.content[1].title").value("Board 2"))
                .andExpect(jsonPath("$.content[1].likedByMe").value(true));
    }

    @Test
    @DisplayName("내 게시물 조회 성공")
    void findMyBoards_shouldReturnPagedBoards() throws Exception {
        // given
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        BoardResponse board1 = BoardResponse.builder()
                .id(1L)
                .title("My Board 1")
                .description("My Description 1")
                .likeCount(2L)
                .likedByMe(true)
                .build();

        List<BoardResponse> boardList = Arrays.asList(board1);
        Page<BoardResponse> mockPage = new PageImpl<>(boardList, PageRequest.of(0, 10), boardList.size());

        when(boardService.findByAuthorId(eq(userId), any(Pageable.class))).thenReturn(mockPage);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(get("/api/board/my")
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].title").value("My Board 1"))
                .andExpect(jsonPath("$.content[0].likedByMe").value(true));
    }

    @Test
    @DisplayName("내 특정 게시물 조회 성공")
    void findMyBoardById_shouldReturnBoardResponse() throws Exception {
        // given
        Long boardId = 1L;
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        BoardResponse mockResponse = BoardResponse.builder()
                .id(boardId)
                .title("My Board")
                .description("My Description")
                .likeCount(4L)
                .likedByMe(true)
                .build();

        when(boardService.findMyBoardById(boardId, userId)).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(get("/api/board/me/{id}", boardId)
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(boardId))
                .andExpect(jsonPath("$.title").value("My Board"))
                .andExpect(jsonPath("$.likedByMe").value(true));
    }

    @Test
    @DisplayName("게시물 수정 성공")
    void update_shouldUpdateBoard() throws Exception {
        // given
        Long boardId = 1L;
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        BoardRequest boardRequest = BoardRequest.builder()
                .title("Updated Board")
                .description("Updated Description")
                .build();

        BoardResponse mockResponse = BoardResponse.builder()
                .id(boardId)
                .title("Updated Board")
                .description("Updated Description")
                .likeCount(3L)
                .likedByMe(false)
                .build();

        when(boardService.update(any(BoardRequest.class), eq(boardId), any(CustomUserDetails.class))).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(put("/api/board/{id}", boardId)
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(boardRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(boardId))
                .andExpect(jsonPath("$.title").value("Updated Board"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    @DisplayName("게시물 좋아요 토글 성공")
    void updateLike_shouldToggleLike() throws Exception {
        // given
        Long boardId = 1L;
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        BoardResponse mockResponse = BoardResponse.builder()
                .id(boardId)
                .title("Test Board")
                .description("Test Description")
                .likeCount(6L)
                .likedByMe(true)
                .build();

        when(boardService.toggleThumbsUp(boardId, userId)).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(put("/api/board/{id}/thumbs-up", boardId)
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(boardId))
                .andExpect(jsonPath("$.likeCount").value(6L))
                .andExpect(jsonPath("$.likedByMe").value(true));
    }
}