package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Board;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByAuthorId(Long authorId);
}
