package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.ProductTag;

public interface ProductTagRepository extends JpaRepository<ProductTag, Long> {

    @Modifying
    @Query("DELETE FROM ProductTag pt WHERE pt.product.id = :productId")
    void deleteAllByProductId(@Param("productId") Long productId);
}
