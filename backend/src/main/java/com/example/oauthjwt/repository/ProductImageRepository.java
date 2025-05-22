package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    boolean existsByImgUrl(String imgUrl);

    void deleteAllByProductId(Long id);
}
