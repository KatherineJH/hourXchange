package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT COALESCE(AVG(r.stars), 0) FROM Review r WHERE r.product = :product")
    double getAverageStarsByProduct(@Param("product") Product product);

    // 판매자 기준 리뷰 수
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.owner = :owner")
    int countByOwner(@Param("owner") User owner);

    // 판매자 기준 별점 평균
    @Query("SELECT COALESCE(AVG(r.stars), 0) FROM Review r WHERE r.product.owner = :owner")
    double getAverageStarsByOwner(@Param("owner") User owner);
}
