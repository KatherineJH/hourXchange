package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.SPImage;

public interface SPImageRepository extends JpaRepository<SPImage, Long> {
  boolean existsByImgUrl(String imgUrl);

  void deleteAllByProductId(Long id);
}
