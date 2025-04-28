package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {}
