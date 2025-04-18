package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBoardId(Long boardId);
}
