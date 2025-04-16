package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.SPImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SPImageRepository extends JpaRepository<SPImage, Long> {
    boolean existsByImgUrl(String imgUrl);
}
