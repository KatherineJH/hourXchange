package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.exception.ValidationException;
import com.example.oauthjwt.repository.BoardRepository;
import com.example.oauthjwt.repository.CommentRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.BoardService;
import com.example.oauthjwt.service.CommentService;
import com.example.oauthjwt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserService userService;
    private final BoardService boardService;

    @Override
    public Map<String, String> existsById(Long id) {
        if (!commentRepository.existsById(id)) { // id로 조회한 정보가 존재하지 않는 경우
            return Map.of("error", "댓글을 찾을 수 없습니다.");
        }
        return Collections.emptyMap();
    }

    @Override
    public CommentResponse findById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ValidationException("댓글을 찾을 수 없습니다."));
        return CommentResponse.toDto(comment);
    }

    @Override
    public List<CommentResponse> findAllByBoardId(Long boardId) {
        List<Comment> comments = commentRepository.findByBoardId(boardId);
        return comments.stream()
                .map(CommentResponse::toDto)
                .toList();
    }

    @Override
    public Map<String, String> saveCheck(CommentRequest commentRequest) {
        Map<String, String> userCheck = userService.existsById(commentRequest.getAuthorId());
        if (!userCheck.isEmpty()) { // 등록한 사용자의 id가 존재하지 않으면
            return userCheck;
        }
        // 게시글이 있는지 조회
        Map<String, String> boardCheck =
                boardService.existsById(commentRequest.getBoardId());
        if (!boardCheck.isEmpty()) { // 게시글 id 값을 통해 값이 존재 하지 않으면
            return boardCheck;
        }
        return Collections.emptyMap();
    }

    @Override
    public CommentResponse save(CommentRequest commentRequest) {
        // 유저 검증
        User owner = userRepository.findById(commentRequest.getAuthorId())
                .orElseThrow(() -> new ValidationException("작성자 정보가 존재하지 않습니다."));

        // 게시글 검증
        Board board = boardRepository.findById(commentRequest.getBoardId())
                .orElseThrow(() -> new ValidationException("해당 게시글이 존재하지 않습니다."));

        // 댓글 생성
        Comment comment = Comment.builder()
                .content(commentRequest.getContent())
                .author(owner)
                .board(board)
                .build();

        Comment result = commentRepository.save(comment);
        return CommentResponse.toDto(result);
    }

    @Override
    public CommentResponse update(CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(commentRequest.getId())
                .orElseThrow(() -> new ValidationException("수정할 댓글이 존재하지 않습니다."));

        comment.setContent(commentRequest.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return CommentResponse.toDto(updatedComment);
    }

    @Override
    public Comment getEntityById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));
    }
}
