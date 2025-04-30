package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
