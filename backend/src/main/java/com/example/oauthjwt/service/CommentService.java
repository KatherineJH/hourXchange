package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.Comment;

public interface CommentService {
  Map<String, String> existsById(Long id);

  CommentResponse findById(Long id);

  List<CommentResponse> findAllByBoardId(Long boardId);

  Map<String, String> saveCheck(CommentRequest commentRequest);

  CommentResponse save(CommentRequest commentRequest);

  CommentResponse update(CommentRequest commentRequest);

  Comment getEntityById(Long id);
}
