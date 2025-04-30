package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.BoardImage;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
  boolean existsByImgUrl(String imgUrl);
}
