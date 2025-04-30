package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
