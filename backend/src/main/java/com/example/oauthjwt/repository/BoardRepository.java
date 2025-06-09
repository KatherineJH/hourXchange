package com.example.oauthjwt.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findByAuthorId(Long authorId, Pageable pageable);
}
