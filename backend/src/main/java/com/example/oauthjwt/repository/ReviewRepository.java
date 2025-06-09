package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.Review;
import com.example.oauthjwt.entity.User;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 판매자 기준 별점 평균
    @Query("SELECT COALESCE(AVG(r.stars), 0) FROM Review r WHERE r.product.owner = :owner")
    double getAverageStarsByOwner(@Param("owner") User owner);

    // ReviewTag by product owner id
    List<Review> findByProductOwnerId(Long ownerId);

    Optional<Review> findByTransactionId(Long transactionId);
}
