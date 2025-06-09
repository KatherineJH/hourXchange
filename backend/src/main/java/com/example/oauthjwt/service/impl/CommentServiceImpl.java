package com.example.oauthjwt.service.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.BoardRepository;
import com.example.oauthjwt.repository.CommentRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.CommentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    @Override
    public CommentResponse findById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."));
        return CommentResponse.toDto(comment);
    }

    @Override
    public List<CommentResponse> findAllByBoardId(Long boardId) {
        List<Comment> comments = commentRepository.findByBoardId(boardId);
        return comments.stream().map(CommentResponse::toDto).toList();
    }

    @Override
    public CommentResponse save(CommentRequest commentRequest) {
        // 유저 검증
        User owner = userRepository.findById(commentRequest.getAuthorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자 정보가 존재하지 않습니다."));
        // 게시글 검증
        Board board = boardRepository.findById(commentRequest.getBoardId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 게시글이 존재하지 않습니다."));
        // 댓글 생성
        Comment comment = Comment.of(commentRequest, owner, board);

        Comment result = commentRepository.save(comment);
        return CommentResponse.toDto(result);
    }

    @Override
    public CommentResponse update(CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(commentRequest.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 댓글이 존재하지 않습니다."));

        comment.setContent(commentRequest.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return CommentResponse.toDto(updatedComment);
    }

    @Override
    public Comment getEntityById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글이 존재하지 않습니다."));
    }
}
