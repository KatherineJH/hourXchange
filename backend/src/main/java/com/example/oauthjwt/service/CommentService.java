package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.Comment;

public interface CommentService {
    CommentResponse findById(Long id);

    List<CommentResponse> findAllByBoardId(Long boardId);

    CommentResponse save(CommentRequest commentRequest);

    CommentResponse update(CommentRequest commentRequest);

    Comment getEntityById(Long id);
}
