package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
    boolean existsByImgUrl(String imgUrl);
}
