package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ReviewTag;

public interface ReviewTagRepository extends JpaRepository<ReviewTag, Long> {
}
