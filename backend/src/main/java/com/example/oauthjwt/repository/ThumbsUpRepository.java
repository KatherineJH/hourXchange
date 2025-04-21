package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.ThumbsUp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThumbsUpRepository extends JpaRepository<ThumbsUp, Long> {
    Optional<ThumbsUp> findByBoardIdAndUserId(Long boardId, Long userId);
    long countByBoardId(Long boardId);
}
