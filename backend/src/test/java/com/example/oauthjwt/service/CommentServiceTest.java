package com.example.oauthjwt.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.entity.type.UserStatus;
import com.example.oauthjwt.repository.BoardRepository;
import com.example.oauthjwt.repository.CommentRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.impl.CommentServiceImpl;

class CommentServiceTest {

    private CommentRepository commentRepository;
    private UserRepository userRepository;
    private BoardRepository boardRepository;
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        commentRepository = mock(CommentRepository.class);
        userRepository = mock(UserRepository.class);
        boardRepository = mock(BoardRepository.class);
        commentService = new CommentServiceImpl(userRepository, commentRepository, boardRepository);
    }

    @Test
    @DisplayName("댓글 단건 조회 성공")
    void findById_success() {
        User author = User.builder().id(1L).email("test@example.com").name("user").role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE).build();
        Board board = Board.builder().id(10L).title("게시글").build();
        Comment comment = Comment.builder().id(1L).content("내용").author(author).board(board).build();

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        CommentResponse result = commentService.findById(1L);
        assertThat(result.getContent()).isEqualTo("내용");
        assertThat(result.getAuthor().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("게시글 ID로 댓글 리스트 조회 성공")
    void findAllByBoardId_success() {
        User author = User.builder().id(1L).email("test@example.com").name("user").role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE).build();
        Board board = Board.builder().id(10L).title("게시글").build();
        Comment comment1 = Comment.builder().id(1L).content("내용1").author(author).board(board).build();
        Comment comment2 = Comment.builder().id(2L).content("내용2").author(author).board(board).build();

        when(commentRepository.findByBoardId(10L)).thenReturn(List.of(comment1, comment2));

        List<CommentResponse> result = commentService.findAllByBoardId(10L);
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getContent()).isEqualTo("내용1");
    }

    @Test
    @DisplayName("댓글 작성 성공")
    void save_success() {
        User author = User.builder().id(1L).email("test@example.com").name("user").role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE).build();
        Board board = Board.builder().id(10L).title("게시글").build();
        CommentRequest request = CommentRequest.builder().authorId(1L).boardId(10L).content("댓글").build();
        Comment saved = Comment.builder().id(100L).content("댓글").author(author).board(board).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(author));
        when(boardRepository.findById(10L)).thenReturn(Optional.of(board));
        when(commentRepository.save(any(Comment.class))).thenReturn(saved);

        CommentResponse result = commentService.save(request);
        assertThat(result.getContent()).isEqualTo("댓글");
        assertThat(result.getAuthor().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("댓글 수정 성공")
    void update_success() {
        User author = User.builder().id(1L).email("test@example.com").name("user").role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE).build();
        Board board = Board.builder().id(10L).title("게시글").build();
        Comment origin = Comment.builder().id(200L).content("이전").author(author).board(board).build();

        CommentRequest updateRequest = CommentRequest.builder().id(200L).content("수정됨").build();

        when(commentRepository.findById(200L)).thenReturn(Optional.of(origin));
        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> inv.getArgument(0));

        CommentResponse updated = commentService.update(updateRequest);

        assertThat(updated.getContent()).isEqualTo("수정됨");
        assertThat(updated.getAuthor().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("엔티티 조회 성공")
    void getEntityById_success() {
        Comment comment = Comment.builder().id(300L).content("댓글").author(
                User.builder().id(5L).email("a@a.com").role(UserRole.ROLE_USER).status(UserStatus.ACTIVE).build())
                .board(Board.builder().id(10L).title("테스트").build()).build();

        when(commentRepository.findById(300L)).thenReturn(Optional.of(comment));

        Comment result = commentService.getEntityById(300L);
        assertThat(result.getContent()).isEqualTo("댓글");
    }
}
