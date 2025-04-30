package com.example.oauthjwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ThumbsUp;

public interface ThumbsUpRepository extends JpaRepository<ThumbsUp, Long> {
    Optional<ThumbsUp> findByBoardIdAndUserId(Long boardId, Long userId);

    long countByBoardId(Long boardId);
}
