package com.example.oauthjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

  List<Comment> findByBoardId(Long boardId);
}
