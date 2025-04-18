package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository  extends JpaRepository<Board, Long> {
}
