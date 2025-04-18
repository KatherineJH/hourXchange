package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.*;
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
        return CommentResponse.toDto(commentRepository.findById(id).get());
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

        User owner = userRepository.findById(commentRequest.getAuthorId()).get(); // 유저 조회
        Board board =
                boardRepository.findById(commentRequest.getBoardId()).get(); // 카테고리 조회

        Comment comment =
                Comment.builder() // 저장할 객체 생성
                        .content(commentRequest.getContent())
                        .author(owner)
                        .board(board)
                        .build();

        Comment result = commentRepository.save(comment); // 저장 후 결과 반환

        return CommentResponse.toDto(result);
    }

    @Override
    public CommentResponse update(CommentRequest commentRequest) {
        Comment comment =
                commentRepository.findById(commentRequest.getId()).get();
        Board board =
                boardRepository.findById(commentRequest.getBoardId()).get();

        commentRequest.setBoard(board); //board DTO에 등록

        Comment result =
                commentRepository.save(
                        comment.setUpdateValue(commentRequest)); // 값 수정

        return CommentResponse.toDto(result); // 반환
    }

    @Override
    public Comment getEntityById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));
    }
}
