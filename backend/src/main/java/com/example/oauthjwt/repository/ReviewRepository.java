package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.ReviewTag;
import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 판매자 기준 별점 평균
    @Query("SELECT COALESCE(AVG(r.stars), 0) FROM Review r WHERE r.product.owner = :owner")
    double getAverageStarsByOwner(@Param("owner") User owner);

    // ReviewTag by product owner id
    List<Review> findByProductOwnerId(Long ownerId);

    Optional<Review> findByTransactionId(Long transactionId);
}
