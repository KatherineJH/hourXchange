package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {}
