package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.entity.type.UserStatus;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.impl.BoardServiceImpl;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class BoardServiceTest {

    private UserRepository userRepository;
    private BoardRepository boardRepository;
    private CategoryRepository categoryRepository;
    private BoardImageRepository boardImageRepository;
    private ThumbsUpRepository thumbsUpRepository;
    private BoardService boardService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        boardRepository = mock(BoardRepository.class);
        categoryRepository = mock(CategoryRepository.class);
        boardImageRepository = mock(BoardImageRepository.class);
        thumbsUpRepository = mock(ThumbsUpRepository.class);
        boardService = new BoardServiceImpl(userRepository, boardRepository, boardImageRepository, categoryRepository, thumbsUpRepository);
    }

    @Test
    @DisplayName("게시글 등록 성공")
    void save_success() {
        // given
        BoardRequest request = BoardRequest.builder()
                .categoryId(2L)
                .title("제목")
                .description("내용")
                .images(List.of("url1", "url2"))
                .build();

        User user = User.builder().id(1L).role(UserRole.ROLE_USER).status(UserStatus.ACTIVE).build();
        CustomUserDetails userDetails = new CustomUserDetails(user);
        Category category = Category.builder().id(2L).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(boardImageRepository.existsByImgUrl(anyString())).thenReturn(false);
        when(boardRepository.save(any(Board.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        BoardResponse response = boardService.save(request, userDetails);
        // then
        assertThat(response.getTitle()).isEqualTo("제목");
        verify(boardRepository).save(any(Board.class));
    }

    @Test
    @DisplayName("게시글 좋아요 토글 - 처음 누르기")
    void toggleThumbsUp_add() throws Exception {
        // given
        Long boardId = 1L, userId = 2L;
        Board board = Board.builder()
                .id(boardId)
                .author(User.builder().id(3L).role(UserRole.ROLE_USER).status(UserStatus.ACTIVE).build())
                .category(Category.builder().id(10L).build())
                .title("title")
                .description("desc")
                .build();
        User user = User.builder().id(userId).role(UserRole.ROLE_USER).status(UserStatus.ACTIVE).build();

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(thumbsUpRepository.findByBoardIdAndUserId(boardId, userId)).thenReturn(Optional.empty());
        when(thumbsUpRepository.countByBoardId(boardId)).thenReturn(1L);

        // when
        BoardResponse response = boardService.toggleThumbsUp(boardId, userId);

        // then
        assertThat(response.getLikeCount()).isEqualTo(1L);
        assertThat(response.isLikedByMe()).isTrue();
        verify(thumbsUpRepository).save(any(ThumbsUp.class));
    }

    @Test
    @DisplayName("게시글 좋아요 토글 - 다시 누르기 (취소)")
    void toggleThumbsUp_remove() throws Exception {
        // given
        Long boardId = 1L, userId = 2L;
        Board board = Board.builder()
                .id(boardId)
                .author(User.builder().id(3L).role(UserRole.ROLE_USER).status(UserStatus.ACTIVE).build())
                .category(Category.builder().id(10L).build())
                .title("title")
                .description("desc")
                .build();
        User user = User.builder().id(userId).build();
        ThumbsUp thumbsUp = new ThumbsUp();
        thumbsUp.setBoard(board);
        thumbsUp.setUser(user);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(thumbsUpRepository.findByBoardIdAndUserId(boardId, userId)).thenReturn(Optional.of(thumbsUp));
        when(thumbsUpRepository.countByBoardId(boardId)).thenReturn(0L);

        // when
        BoardResponse response = boardService.toggleThumbsUp(boardId, userId);

        // then
        assertThat(response.getLikeCount()).isEqualTo(0L);
        assertThat(response.isLikedByMe()).isFalse();
        verify(thumbsUpRepository).delete(thumbsUp);
    }

    @Test
    @DisplayName("게시글 수정 실패 - 작성자 불일치")
    void update_fail_wrongAuthor() {
        // given
        Long boardId = 1L;
        User author = User.builder().id(1L).build();
        Board board = Board.builder().id(boardId).author(User.builder().id(1L).role(UserRole.ROLE_USER).status(UserStatus.ACTIVE).build()).build();
        BoardRequest request = BoardRequest.builder()
                .categoryId(3L)
                .title("제목")
                .description("설명")
                .build();

        CustomUserDetails wrongUser = new CustomUserDetails(
                User.builder().id(999L).build() // 다른 사용자
        );

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        // expect
        assertThatThrownBy(() -> boardService.update(request, boardId, wrongUser))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("작성자만 수정할 수 있습니다.");
    }
}
