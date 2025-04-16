package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
